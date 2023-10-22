const express = require('express');
const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const { Router } = require('express');
const catchAsyncError = require('../middleware/catchAsyncError.js');
const { loginBodyValidation, signUpBodyValidation, passwordValidation } = require("../utils/validationSchema.js");
const generateTokens = require("../utils/generateToken.js");
const jwt = require("jsonwebtoken");
const verifyRefreshToken = require("../utils/verifyRefreshToken.js");
const { refreshTokenBodyValidation } = require("../utils/validationSchema.js");
const userTokenModel = require('../models/userTokenModel.js');
const nodeMailer = require('nodemailer');
const config = require('../config/config.js');
const randomSrtring = require('randomstring');
const otpGenerator = require('otp-generator');
const moment = require("moment");
const postModel = require('../models/postModel.js');
const masterTableModel = require('../models/masterTableModel.js');
const MongoCli = require('../config/mongo-client');
const publicDir = require('path').join(__dirname, '../uploads');
const multer = require('multer');
const fs = require('fs');
const path = require("path")
const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');
const { getVideoDurationInSeconds } = require('get-video-duration')
const https = require('https');
const serve = require('express-static');



// SMTP Send mail for verify
const sendVerifyMail = catchAsyncError(async (email, user_id) => {

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        requireTLS: true,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword
        }
    });
    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Verification Mail',
        html: '<p>Hii ' + email + ', Please copy  the below link and <a href="http://45.79.126.10:3004/api/auth/user/verify?id=' + user_id + '">verify</a> your mail. </p>'
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Mail has been sent:-", info.response);
        }
    });
});

// SMTP detail for forget password
const sendResetPasswordEmail = catchAsyncError(async (email, id) => {

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: false,
        requireTLS: true,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword
        }
    });

    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Reset Password',
        html: `<p>Hii ${email}, Please copy  the below link and <a href=http://45.79.126.10:3004/api/email/${id}>reset password.</a> </p>`
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Mail has been sent:-", info.response);
        }
    });
});

const resetPasswordMail = async (email, id) => {
    let mailTransporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'info@razeracing.com',
            // pass: "txcwltzqrcwrpaha"
            pass: "anrzlaljmtnwkdzz"
            // pass: 'goldenfish@1234'
        }

    });

    let mailDetails = {
        from: 'pigglygames.com',
        to: email,
        subject: 'To Reset Password',
        html: `Click on link to reset your password,
        http://45.79.126.10:3004/email/${id}`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });
}

// Sign Up 
const registerUser = catchAsyncError(async (req, res) => {
    try {
        // const realPath = serve(path.join(__dirname, '../uploads'));
        console.log("recivedData", req.body)
        const b = moment().utc();


        let realPath = path.join(__dirname, '../../uploads')
        const user = await userModel.findOne({ email: req.body.email });
        const handleName = await userModel.findOne({ username: req.body.username });

        if (user) {
            return res.status(400).json({ error: false, message: "User with given email already exist !" });
        }
        else if (handleName) {
            return res.status(400).json({ error: false, message: "This username already in exist !" });
        }

        // await new userModel({ ...req.body, password: hashPassword }).save();
        if (req.body.registration_process == 'google' || req.body.registration_process == 'facebook') {
            const userData = await userModel.create({
                ...req.body,
                is_verify: '1',
                isOnline: false,
                profile_image: realPath + '/' + `${req.file.filename}`,
                registration_process: req.body.registration_process

            });
            res.status(200).json({ success: true, message: "User created successfully !", user: userData });
        }
        else {
            const { error } = signUpBodyValidation(req.body);
            if (error)
                return res.status(400).json({ success: false, message: error.details[0].message });
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            const code = await bcrypt.hash(String(b), salt);
            const userData = await userModel.create({
                ...req.body,
                password: hashPassword,
                verification_code: code,
                isOnline: false,
                profile_image: realPath + '/' + `${req.file.filename}`,
                registration_process: req.body.registration_process
            });
            sendVerifyMail(req.body.email, userData.verification_code);
            res.status(200).json({ success: true, message: "User created successfully !", user: userData });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// handle Email for user
const handleEmail = catchAsyncError(async (req, res) => {
    try {
        const reqBody = req.body;
        const { email } = reqBody;
        if (!email) {
            return res.status(400).json({ success: true, message: "Email field is required !" });
        }
        const user = await userModel.findOne({ email: email });

        if (user) {
            return res.status(400).json({ success: false, message: "User with given email already exist !" });
        }
        else {
            return res.status(200).json({ success: true, message: "User can use this email !" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
})

// handeluser u=nique name
const handleusername = catchAsyncError(async (req, res) => {
    try {
        const reqBody = req.body;
        const { username } = reqBody;
        if (!username) {
            return res.status(400).json({ success: false, message: "Username field is required !" });
        }
        const handleName = await userModel.findOne({ username: username });
        if (handleName) {
            return res.status(400).json({ success: false, message: "This username already in exist !" });
        }
        else {
            return res.status(200).json({ success: true, message: "User can use this username !" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }
})

// Unregister user
const unRegisterUser = catchAsyncError(async (req, res) => {
    try {
        // const reqBody = req.body;
        const findUser = await userModel.findOne({ status: "unregister" });

        if (findUser == null) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash("12345", salt);
            const createUser = await userModel.create({
                first_name: "Abc",
                last_name: "DEF",
                username: "guest",
                password: hashPassword,
                email: "abc@user.com",
                is_verify: "1",
                status: false
            });
            res.status(200).json({ success: true, message: "User created successfully! !", user: createUser });

        }
        else {
            res.status(200).json({ success: true, message: "User allready exist !", user: findUser });
        }

    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

// @desc Verify User and gerenarte Code for QR
// @route GET /api/user/verify
// @access public
const verifyUser = catchAsyncError(async (req, res) => {

    const user = await userModel.findOne({ verification_code: req.query.id });
    if (!user) {
        res.status(400).json({ success: false, message: "Verification link is not valid !", });

    }
    else {

        const interval = 1 * 1000; // 1 seconds;
        for (let i = 0; i <= 2; i++) {

            setTimeout(async function () {


                const updateVerify = await userModel.findOneAndUpdate({ _id: user._id },
                    {
                        $push: {
                            QR: {
                                user_id: user._id,
                                timestamp: moment().utc().valueOf()
                            }
                        }
                    });
            }, interval * i, i);
        }
        const updateVerify = await userModel.findOneAndUpdate({ verification_code: req.query.id },
            {
                $set: { is_verify: 1, on_boarding: true, verification_code: "" }
            },
            { new: true });

        res.status(200).json({ success: true, message: "User email is verified !", });

    }

});



const loginUser = catchAsyncError(async (req, res) => {
    try {

        const user = await userModel.findOne({ email: req.body.email });

        if (!user)
            return res.status(400).json({ success: false, message: "Inavlid email or password !" });

        if (user.is_deleted == true)
            return res.status(400).json({ success: false, message: "User does not exist !" });

        if (user.registration_process == 'google' || user.registration_process == 'facebook') {
            const { error } = loginBodyValidation(req.body);
            if (error)
                return res.status(400).json({ success: false, message: error.details[0].message });
            const { accessToken, refreshToken } = await generateTokens(user);

            res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                message: "Logged in successfully !",
                user: user
            });
        }
        else {
            const varifiedPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (!varifiedPassword) {
                return res.status(400).json({ success: false, message: "Invalid email or password" });
            }
            else if (user.is_verify != 1) {
                return res.status(400).json({ success: false, message: "The email is not verifed !" });
            }



            // generate refresh token and access token
            const { accessToken, refreshToken } = await generateTokens(user);

            res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                message: "Logged in successfully !",
                user: user
            });

        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: err.message });
    }

});

// @desc Post reset password
// @route POST /api/user/reset/password
// @access private
const forgetPassword = catchAsyncError(async (req, res, next) => {
    const email = req.body.email;
    const userData = await userModel.findOne({ email: email });

    if (userData) {

        const randomCode = otpGenerator.generate(16, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const user = await userModel.findOneAndUpdate({ email: email }, { $set: { reset_password_request: randomCode } }, { new: true });
        sendResetPasswordEmail(userData.email, randomCode);
        res.status(200).json({ success: true, message: "Reset password mail sent !", user: user });
    } else {
        res.status(400).json({ sucess: true, message: "This email is not exists !" });
    }

});


const email = catchAsyncError(async (req, res) => {
    try {
        console.log("user");
        //   const user = req.user
        // const id = user._id

        const dat = req.params.id
        const user = await userModel.findOne({ reset_password_request: dat });
        if (user) {
            res.render("index")

        }
        else {
            res.status(401).send({ success: false, message: "There is no letest request for reset password !" })
        }

    } catch (error) {
        res.status(400).send({ success: false, error })
    }
});

// @desc Reset password 
// @route POST /api/reset/password 
// @access private
const resetPassword = catchAsyncError(async (req, res) => {
    try {
        // const {new}
        const { error } = passwordValidation(req.body.password);
        console.log("hhjhjhjj")
        const { id } = req.params
        // console.log(email);
        // const emailId = `http://localhost:8082/email?${req.params.link}`   
        console.log(id);
        const data = await userModel.findOne({ reset_password_request: id })
        if (data) {
            const userFound = await userModel.findOne({ _id: data._id });
            if (userFound) {
                if (data.reset_password_request != "") {
                    console.log("body", req.body);
                    const password = req.body.password

                    const confirmpass = req.body.confirmpass
                    const salt = await bcrypt.genSalt(Number(process.env.SALT));
                    const hashPassword = await bcrypt.hash(password, salt);
                    console.log("password", hashPassword);
                    if (password == confirmpass) {
                        const userdata = await userModel.findOneAndUpdate({ _id: data._id }, { $set: { password: hashPassword, reset_password_request: "" } }, { new: true })
                        res.status(200).send({ success: true, message: "User password has been changed !" })

                    } else {
                        res.status(401).send({ success: false, message: "Confirm password are not same password !" })
                    }
                }
                else {
                    res.status(401).send({ success: false, message: "You have already updated your password !" })
                }
            } else {
                res.status(401).send({ success: false, message: "email not found" })
            }
        }
        else {
            res.status(401).send({ success: false, message: "There is no letest request for reset password !" })
        }

    } catch (error) {
        console.log(error);
        res.send(error)
    }
});



// @desc Delete  profile
// @route DELETE /api/profile/:id 
// @access private
const deleteUser = catchAsyncError(async (req, res) => {
    try {
        const user = await userModel.findOneAndUpdate({ _id: req.user._id },
            {
                $set: { is_deleted: true }
            }
            , { new: true }
        );

        res.status(200).json({ status: true, message: "Use deleted successfully !", user: user });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }


});


// Profile start here........................ 


// @desc get  profile
// @route GET /api/profile
// @access private
const getUserProfile = catchAsyncError(async (req, res, next) => {
    try {
        const user = await userModel.findOne({ _id: req.user._id });
        res.status(200).json({ success: true, message: "User profile !", user_profile: user });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});

// @desc Update  profile
// @route PUT /api/profile/:id 
// @access private
const updateProfile = catchAsyncError(async (req, res, next) => {
    try {
        console.log("image", req.file.filename);
        let realPath = path.join(__dirname, '../../uploads')
        const reqBody = req.body;
        const { first_name, last_name, username, bio, location, gender, date_of_birth } = reqBody;
        const searchedProfile = await userModel.findOne({ _id: req.user._id });

        if (searchedProfile != null) {

            const updateProfile = await userModel.findOneAndUpdate({ _id: req.user._id },
                {
                    $set: {
                        first_name: first_name,
                        last_name: last_name,
                        username: username,
                        bio: bio,
                        gender: gender,
                        date_of_birth: date_of_birth,
                        location: location,
                        profile_image: realPath + '/' + `${req.file.filename}`
                    }
                }, { new: true }

            );
            res.status(200).json({ success: true, message: "User updated successfully !", profile: updateProfile });
        }
        else {
            res.status(401).json({ success: false, message: "User does not exist !" });
        }
    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }


});


const newToken = catchAsyncError(async (req, res) => {
    const reqBody = req.body;
    const { error } = refreshTokenBodyValidation(reqBody);
    if (error)
        return res
            .status(400)
            .json({ error: true, message: error.details[0].message });

    const refreshToken = reqBody.refreshToken
    const token = await userTokenModel.findOne({ token: refreshToken });
    console.log("token", reqBody.refreshToken);
    verifyRefreshToken(refreshToken)
        .then(({ tokenDetails }) => {
            const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };

            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_PRIVATE_KEY,
                { expiresIn: "1h" }
            );

            res.status(200).json({
                error: false,
                accessToken,
                message: "Access token created successfully",
            });
        })
        .catch((err) => res.status(400).json(err));

});

// generate QR timestamp for User 
const generateQrForUser = catchAsyncError(async (req, res) => {
    const authUser = req.user._id
    const QrCodeLength = await userModel.findOne({ _id: authUser });
    const Qrlength = QrCodeLength.QR;
    if (Qrlength.length == 4) {
        const user = await userModel.findOne({ _id: authUser });
        res.status(200).json({ success: true, message: "You have limited QR, can nnot create more QR !", data: user });

    }
    else {
        const findUser = await userModel.findOneAndUpdate({ _id: authUser },
            {
                $push: {
                    QR: {
                        user_id: authUser,
                        timestamp: moment().utc().valueOf()
                    }
                }
            },
            { new: true });
        res.status(200).json({ success: true, message: "Qr is generated !", data: findUser });
    }

});

// add post to QR code
const addPostToQr = catchAsyncError(async (req, res) => {
    await MongoCli.init();
    const authUser = req.user._id

    const reqBody = req.body;
    const year = moment().format('YYYY');
    const { timestamp, post_id } = reqBody;
    const findTable = await masterTableModel.find({});
    console.log("post", findTable[0].from);
    let finalTableData = null;
    for (let i = 0; i <= findTable.length; i++) {
        console.log("i", i);
        if (findTable[i].from >= post_id && findTable[i].to <= post_id) {
            finalTableData = findTable[i]
            break;
        }
    }
    // const tasks = await MongoCli.db.collection().find({}).toArray();


    if (finalTableData != null) {
        const tasks = await MongoCli.db.collection(String(finalTableData.post_table_name)).find({}).toArray();
        const table = null;
        for (let postId of tasks) {
            if (postId.post_id == post_id) {
                table = postId;
                break;
            }
        }
        console.log("table", table);
        const updateQr = await userModel.findByIdAndUpdate({ _id: authUser });
        const Qrlength = updateQr.QR;
        console.log("update", updateQr.QR[0].timestamp);
        for (let i = 0; i <= Qrlength.length; i++) {
            if (updateQr.QR[i].timestamp == timestamp) {
                updateQr.QR[i].post_id = post_id
                break;
            }
        }
        updateQr.save();
        const findQr = await userModel.findOne({ _id: authUser });

        res.status(200).json({ success: true, message: "Post added with QR !", data: findQr });
    }
    else {
        res.status(200).json({ success: false, message: "This post is not belongs to you !" });
    }

})



// upload file

const uploadFile = catchAsyncError(async (req, res) => {
    try {
        let currentFile = `${req.file.filename}`
        let videoLegnth = "";

        let realPath = path.join(__dirname, '../../uploads/')
        console.log("patjhsjkdhas", realPath)
        getVideoDurationInSeconds(
            realPath + currentFile
        ).then((duration) => {
            videoLegnth = duration
            console.log("videoLength", duration)
        })

        const ext = `${req.file.filename}`
            .split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        if (ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'gif' || ext == 'tiff' || ext == 'psd' || ext == 'pdf' || ext == 'eps' || ext == 'ai' || ext == 'indd' || ext == 'raw') {
            res.status(200).json({ success: true, message: "Image uploaded successfully !", imagepath: currentFile })
        }
        else {
            if (videoLegnth > req.body.videoDuration) {
                res.status(400).json({ success: false, message: "Video length is already less than request duration !" });
            }
            else {
                // trimVideo(currentFile, req.body.videoTime, req.body.videoDuration);
                const startTime = req.body.videoTime;
                const duration = req.body.videoDuration;
                const inputFilePath = realPath + currentFile;
                console.log("filePath", inputFilePath);
                const extension = path.extname(inputFilePath);
                const nameWithoutExt = currentFile.replace(extension, "")
                const fileName = nameWithoutExt + Date.now() + extension;
                var outputFilePath = realPath + Date.now() + extension;
                const fileNemOfTrimmedVideo = Date.now() + extension
                const command = `${ffmpeg} -i ${inputFilePath} -ss ${startTime} -t ${duration} -c:v copy -c:a copy ${outputFilePath}`;
                exec(command, (error, stdout, stderr) => {
                    console.log(stderr)
                    console.log(stdout)
                    if (error) {
                        console.error(`Error trimming video: ${error}`);
                    } else {
                        fs.unlink(inputFilePath, (err) => {
                            if (err) {
                                throw err;
                            }
                        })
                        console.log(`Video trimmed successfully. Output saved to: ${outputFilePath}`);

                        res.status(200).json({ success: true, message: "Video trimmed successfully", videoUrl: fileNemOfTrimmedVideo });
                    }
                });
            }
        }
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }


});



// try {
//     fs.unlinkSync('file.txt');

//     console.log("Delete File successfully.");
//   } catch (error) {
//     console.log(error);
//   }

const logout = catchAsyncError(async (req, res) => {

    try {
        const { error } = refreshTokenBodyValidation(req.body);
        if (error)
            return res.status(400).json({ success: false, message: error.details[0].message });

        const userAccessToken = await userTokenModel.findOneAndRemove({ token: req.body.refreshToken });
        if (!userAccessToken)
            return res.status(400).json({ success: false, message: "Token not found !" });

        // await userAccessToken.remove();
        res.status(200).json({ success: true, message: "Logged Out Successfully !" });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
});


// Get video buffer*********************

const getVideo = catchAsyncError(async (req, res) => {

    console.log("filename", req.query.name)
    let realPath = path.join(__dirname, '../../uploads/')
    const videoPath = realPath + `${req.query.name}`;
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        console.log('we have range', range, "\n\n", videoPath);
        const parts = range.replace(/bytes=/, "").split("-")
        console.log('we have2 range', parts);
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        console.log('we have3 range', end);

        const chunksize = (end - start) + 1
        console.log('we have4 range', chunksize);
        const file = fs.createReadStream(videoPath, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        console.log('no range', range);
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(videoPath).pipe(res)
    }

})



module.exports = {
    registerUser,
    handleEmail,
    handleusername,
    unRegisterUser,
    verifyUser,
    forgetPassword,
    email,
    getUserProfile,
    updateProfile,
    resetPassword,
    deleteUser,
    loginUser,
    newToken,
    generateQrForUser,
    addPostToQr,

    uploadFile,
    getVideo,
    logout
};