const adminModel = require("../models/adminModel")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const userModel = require("../models/userModel");
var CryptoJS = require("crypto-js");
const moment = require('moment');
const year = moment().format('YYYY');
const dynamicPostSchema = require("../models/postModel")(year);
const followModel = require("../models/followModel")
const followingModel = require("../models/followingModel")
const likeModel = require("../models/likeModel")
const commentModel = require("../models/commentsModel")
const nodemailer = require('nodemailer');
const cmsModel = require("../models/cmsModel")
const blockModel = require("../models/blockModel")
const reportModel = require("../models/reportModel")

const commentReplyModel = require("../models/commentReplyModel")
const likeCommentModel = require("../models/likeCommentModel")
// const likeReply = require("../models/likeReplyModel");
const likeReplyModel = require("../models/likeReplyModel");
const replyToReplyModel = require("../models/replyToReplyModel");
const replyToReplyLikeModel = require("../models/replyToReplyLikeModel");



exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let query = { email: req.body.email };

        if (!email || !password)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required !" });

        if (email == 'admin@gmail.com' && password == 'admin123') {
            let userData = await adminModel.findOne(query);
            if (!userData) {
                const admin = await adminModel.create({
                    password: bcrypt.hashSync(password),
                    email: req.body.email
                })


                const accessToken = jwt.sign(
                    {
                        success: true,
                        message: "User detail !",
                        user: {
                            email: admin.email,
                            password: admin.password,
                            _id: admin._id,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "1d" }
                );

                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(admin), 'secret key 123').toString();
                var encryptToken = CryptoJS.AES.encrypt(JSON.stringify(accessToken), 'secret key 123').toString();
                var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
                var originalText = bytes.toString(CryptoJS.enc.Utf8);

                return res.send({ reponseCode: 200, success: true, responseMessage: 'Admin created  Successfully', responseResult: ciphertext, token: encryptToken },);
            }
            else {

                let passCheck = bcrypt.compareSync(password, userData.password);

                if (passCheck == false) {
                    return res.send({ reponseCode: 200, success: false, responseMessage: 'Incorrect password.' })
                }
                else {

                    const accessToken = jwt.sign(
                        {
                            success: true,
                            message: "User detail !",
                            user: {
                                email: userData.email,
                                password: userData.password,
                                _id: userData._id,
                            },
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: "1d" }
                    );

                    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(userData), 'secret key 123').toString();
                    var encryptToken = CryptoJS.AES.encrypt(JSON.stringify(accessToken), 'secret key 123').toString();
                    var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
                    var originalText = bytes.toString(CryptoJS.enc.Utf8);

                    return res.send({ responseCode: 200, success: true, responseMessage: "Admin login successfully", responseResult: ciphertext, token: accessToken })
                }
            }
        }
        else {
            return res.send({ responseCode: 200, success: false, responseMessage: "Email or password is wrong!" })
        }
    } catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message, });
    }
}


exports.userList = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })

        const userdata = await userModel.find({})

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(userdata), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "User data get successfully", responseResult: ciphertext })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message, });
    }
}


exports.activeUser = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const activedata = await userModel.find({ $and: [{ isOnline: false }, { is_deleted: false }] })
        if (!activedata)
            return res.send({ responseCode: 200, success: false, responseMessage: "User not found" })

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(activedata), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "Active user get successfully!", responseResult: ciphertext })

    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}



exports.blockList = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })

        const blockdata = await userModel.find({ is_deleted: true })
        if (!blockdata) {
            return res.send({ responseCode: 200, success: false, responseMessage: "User not found" })
        }
        else {
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(blockdata), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Block user get successfully", responseResult: ciphertext })
        }

    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.deletedPostList = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })

        const postdata = await dynamicPostSchema.find({ is_deleted: true }).populate('user_id')
        if (!postdata)
            return res.send({ responseCode: 200, success: false, responseMessage: "Post not found" })

        let postArray = []
        if (postdata.length >= 0) {
            for (let i of postdata) {

                const likedata = await likeModel.find({ post_id: i._id }).populate('like_by_user')
                const commentdata = await commentModel.find({ post_id: i._id }).populate('comment_by_user')
                const reportedPost = await reportModel.find({ post_id: i._id }).populate('reported_user_id')
                const reported = await reportModel.find({ post_id: i._id }).populate('reported_user_id')
                const reportLength = reported.length
                let commentRelatedData = [];
                for (let j of commentdata) {
                    const comment = j;
                    const commentLike = await likeCommentModel.find({ comment_id: j._id }).populate('like_by_user_id')
                    const replyComment = await commentReplyModel.find({ comment_id: j._id }).populate('reply_to_user_id')
                    let replyRelatedData = [];
                    for (let k of replyComment) {
                        const replyLike = await likeReplyModel.find({ reply_id: k._id }).populate('like_by_user_id')
                        const subReply = await replyToReplyModel.find({ reply_id: k._id }).populate('reply_to_user_id')
                        let subReplyData = [];
                        for (let m of subReply) {
                            const subReplyLike = await replyToReplyLikeModel.find({ subReply_id: m._id }).populate('user_id').populate('like_to_user_id');
                            let subreplyLikeArray = {
                                subreply: m,
                                subReply: subReplyLike
                            }
                            subReplyData.push(subreplyLikeArray)


                            let replyArray = {
                                reply: k,
                                replyLike: replyLike,
                                subReplyData: subReplyData
                            }
                            replyRelatedData.push(replyArray);
                        }
                    }
                    let commentArray = {
                        comment: j,
                        commentLike: commentLike,
                        replyRelatedData: replyRelatedData
                    }
                    commentRelatedData.push(commentArray);
                }

                let arraydata = {
                    post: i,
                    likes: likedata,
                    // comments: commentdata,
                    reportedPost: reportedPost,
                    reportedPostCount: reportLength,
                    comments: commentRelatedData,

                }
                postArray.push(arraydata)
            }

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postArray), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Deleted post get successfully", responseResult: ciphertext })
        }
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.specificUserProfile = async (req, res) => {
    try {
        const reqBody = req.body;
        const { userId } = reqBody;
        if (!userId)
            return res.send({ responseCode: 200, success: false, responseMessage: "Feilds are required!" })

        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const userdata = await userModel.findOne({ _id: userId })

        if (!userdata) {
            return res.send({ responseCode: 200, success: false, responseMessage: "User not found" })
        }
        const totalPost = await dynamicPostSchema.find({ user_id: userId })
        // console.log("userData", totalPost)
        // if (totalPost.length == 0) {
        //     return res.send({ responseCode: 200, success: false, responseMessage: "User doesn`t have any post" })
        // }
        // else {
        const totalFollower = await followModel.find({ user_id: userId }).populate('follower_id')
        const totalFollowing = await followingModel.find({ user_id: userId }).populate('following_id')
        const findReport = await reportModel.find({ reported_user_id: userId }).populate('reported_user_id')

        const reportedMe = await reportModel.find({ user_id: userId }).populate('reported_user_id')

        const findBlockedByMe = await blockModel.find({ block_user_id: userId }).populate('block_user_id')
        const findBlockedMe = await blockModel.find({ user_id: userId })
        const totallike = await likeModel.find({ user_id: userId }).populate('like_by_user')

        const totalcomment = await commentModel.find({ user_id: userId }).populate('comment_by_user')

        const findBlockedByMeCount = findBlockedByMe.length
        const findBlockedMeCount = findBlockedMe.length
        const reportedByMeCount = findReport.length
        const reportedMeCount = reportedMe.length
        const postCount = totalPost.length
        const totalFollowerCount = totalFollower.length
        const totalFollowingCount = totalFollowing.length
        const totallikeCount = totallike.length
        const totalcommentCount = totalcomment.length

        const userInfo = {
            userdata
        }
        let specificPostArray = [{
            userInfo: userdata,
            follow: totalFollower,
            following: totalFollowing,
            reportedByMe: findReport,
            reportedMe: reportedMe,
            findBlockedByMe: findBlockedByMe,
            findBlockedMe: findBlockedMe,

            findBlockedByMeCount: findBlockedByMeCount,
            findBlockedMeCount: findBlockedMeCount,
            reportedByMeCount: reportedByMeCount,
            reportedMeCount: reportedMeCount,
            postCount: postCount,
            totalFollower: totalFollowerCount,
            totalFollowing: totalFollowingCount,
            totallike: totallikeCount,
            totalcomment: totalcommentCount
        },
        ]
        const allPosts = [];
        if (totalPost.length >= 0) {
            for (let i of totalPost) {
                const totalPost = i
                const totallike = await likeModel.find({ post_id: i._id }).populate('like_by_user')
                const totalcomment = await commentModel.find({ post_id: i._id }).populate('comment_by_user')
                let commentRelatedData = [];
                for (let j of totalcomment) {
                    const comment = j;
                    const commentLike = await likeCommentModel.find({ comment_id: j._id }).populate('like_by_user_id')
                    const replyComment = await commentReplyModel.find({ comment_id: j._id }).populate('reply_to_user_id')
                    let replyRelatedData = [];
                    for (let k of replyComment) {
                        const replyLike = await likeReplyModel.find({ reply_id: k._id }).populate('like_by_user_id')
                        const subReply = await replyToReplyModel.find({ reply_id: k._id }).populate('reply_to_user_id')
                        let subReplyData = [];
                        for (let m of subReply) {
                            const subReplyLike = await replyToReplyLikeModel.find({ subReply_id: m._id }).populate('user_id').populate('like_to_user_id');
                            let subreplyLikeArray = {
                                subreply: m,
                                subReply: subReplyLike
                            }
                            subReplyData.push(subreplyLikeArray)


                            let replyArray = {
                                reply: k,
                                replyLike: replyLike,
                                subReplyData: subReplyData
                            }
                            replyRelatedData.push(replyArray);
                        }
                    }
                    let commentArray = {
                        comment: j,
                        commentLike: commentLike,
                        replyRelatedData: replyRelatedData
                    }
                    commentRelatedData.push(commentArray);
                }

                const arraydata = {
                    post: totalPost,
                    likes: totallike,
                    comments: commentRelatedData,
                }

                allPosts.push(arraydata)

            }


            specificPostArray = [{ ...specificPostArray[0], posts: allPosts }]

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(specificPostArray[0]), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return res.send({ responseCode: 200, success: true, responseMessage: "Specific user profile get successfully", responseResult: ciphertext })
        }
        // }
    }
    catch (error) {
        return res.send({ responseCode: 200, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}

exports.notifyUser = async (req, res) => {
    try {
        const { subject, description } = req.body;
        if (!subject || !description)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required" })
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })

        const recipients = [];
        const userData = await userModel.find({ $and: [{ is_deleted: false }, { isBlocked: false }] })

        for (let i = 0; i < userData.length; i++) {
            recipients.push(userData[i]?.email)
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: false,
            requireTLS: true,
            auth: {
                user: "mailto:rajendrakashyap7302598@gmail.com",
                pass: "dalvmksongilcvjr",
            },
        });

        const commonMailOptions = {
            from: 'rajendrakashyap7302598@gmail.com',
            subject: subject,
            text: description // Description
        };


        recipients.forEach((recipient) => {
            const mailOptions = {
                ...commonMailOptions,
                to: recipient,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                    res.status(500).json({ error: 'An error occurred while sending the email.' });
                } else {
                    console.log('Email sent:', info.response);
                    return res.send({ responseCode: 200, success: true, responseMessage: 'Email sent successfully.' });
                }
            });
        });
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.termsCondition = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const { termsAndConditions, privacyPolicy } = req.body
        if (!termsAndConditions || !privacyPolicy)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required !" })

        const finsdcms = await cmsModel.find({})
        if (finsdcms.length >= 1)
            return res.send({ responseCode: 200, success: false, responseMessage: "Cms already created" })

        const cmsData = await cmsModel.create({
            termsAndConditions,
            privacyPolicy
        })

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(cmsData), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "Cms created successfully", responseResult: ciphertext })

    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.updateCms = async (req, res) => {
    try {
        const reqBody = req.body;
        const { cmsId } = reqBody;
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const { termsAndConditions, privacyPolicy } = req.body

        const findcms = await cmsModel.findOne({ _id: cmsId })
        if (!findcms)
            return res.send({ responseCode: 200, success: false, responseMessage: "Cms id not found" })

        if (termsAndConditions) {
            const cmsdata = await cmsModel.findOneAndUpdate(
                { _id: cmsId },
                {
                    $set: {
                        termsAndConditions: termsAndConditions
                    },
                },
                { new: true }
            );

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(cmsdata), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Term and condition update successfully", responseResult: ciphertext })
        }
        else {
            const findcms = await cmsModel.findOne({ _id: req.body.cmsId })
            if (!findcms)
                return res.send({ responseCode: 200, success: false, responseMessage: "Cms id not found" })

            const cmsdata = await cmsModel.findOneAndUpdate(
                { _id: req.body.cmsId },
                {
                    $set: {
                        privacyPolicy: privacyPolicy
                    },
                },
                { new: true }
            );

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(cmsdata), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Privacy policy update successfully", responseResult: ciphertext })
        }
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.deleteUser = async (req, res) => {
    try {
        const reqBody = req.body;
        const { userId } = reqBody;
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })

        const findUser = await userModel.findOne({ $and: [{ _id: userId }, { is_deleted: false }] })
        if (!findUser)
            return res.send({ responseCode: 200, success: false, responseMessage: "Userid not found" })

        const deleted = await userModel.updateMany(
            { _id: userId },
            {
                $set: {
                    is_deleted: true,
                },
            },
            { new: true }
        );

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(deleted), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "User deleted successfully", responseResult: ciphertext })

    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.blockUser = async (req, res) => {
    try {
        const reqBody = req.body;
        const { userId } = reqBody;
        if (!userId)
            return res.send({ responseCode: 200, success: false, responseMessage: "Feilds are required !" })

        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })

        const findblock = await userModel.findOne({ _id: req.body.userId })
        if (!findblock)
            return res.send({ responseCode: 200, success: false, responseMessage: "This userid not found!" })


        const blockData = await userModel.updateMany(
            { $and: [{ _id: userId }, { is_deleted: false }] },
            {
                $set: {
                    is_deleted: true,
                },
            },
            { new: true }
        );

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(blockData), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "User block successfully", responseResult: ciphertext })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.reportDelete = async (req, res) => {
    try {
        const reqBody = req.body;
        const { report_id, type } = reqBody;
        if (!report_id || !type)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required" })

        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const finduser = await reportModel.findOne({ _id: report_id })
        if (!finduser)
            return res.send({ responseCode: 200, success: false, responseMessage: "This userid not found!" })

        if (type == "Delete") {
            const deleted = await reportModel.findOneAndUpdate(
                { _id: report_id },
                {
                    $set: {
                        status: true,
                    },
                },
                { new: true }
            );

            const userDeleted = await userModel.findOneAndUpdate(
                { _id: finduser.reported_user_id },
                {
                    $set: {
                        is_deleted: true,
                    },
                },
                { new: true }
            );

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(deleted), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Report user deleted successfully", responseResult: ciphertext })
        }
        else if (type == "Remove") {
            const finduser = await reportModel.findOne({ user_id: user_id })
            if (!finduser)
                return res.send({ responseCode: 200, success: false, responseMessage: "This userid not found!" })
            const deleted = await reportModel.findOneAndDelete({ $and: [{ user_id: user_id }, { status: true }] });

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(deleted), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Report user remove successfully", responseResult: ciphertext })
        }
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}



exports.postReportDelete = async (req, res) => {
    try {
        const reqBody = req.body;
        const { report_id, type } = reqBody;

        if (!type || !report_id)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required" })

        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const finduser = await reportModel.findOne({ _id: report_id })
        if (!finduser)
            return res.send({ responseCode: 200, success: false, responseMessage: "This postId not found!" })

        if (type == "Delete") {
            const deleted = await reportModel.findOneAndUpdate(
                { _id: report_id },
                {
                    $set: {
                        status: true,
                    },
                },
                { new: true }
            );

            const postDeleted = await dynamicPostSchema.findOneAndUpdate(
                { $and: [{ _id: finduser.post_id }, { is_deleted: false }] },
                {
                    $set: {
                        is_deleted: true,
                    },
                },
                { new: true }
            );

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(deleted), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Report post deleted successfully", responseResult: ciphertext })
        }
        else if (type == "Remove") {
            const finduser = await reportModel.findOne({ _id: post_id })
            if (!finduser)
                return res.send({ responseCode: 200, success: false, responseMessage: "This postId not found!" })
            const deleted = await reportModel.findOneAndDelete({ $and: [{ post_id: post_id }, { status: true }] });

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(deleted), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Post report remove successfully", responseResult: ciphertext })
        }
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.findCmsdata = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const userdata = await cmsModel.findOne({})

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(userdata), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "Cms get successfully", responseResult: ciphertext })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.postCreate = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, post_id, name, ImageCode, Message } = reqBody
        if (!user_id || !post_id || !name || !ImageCode || !Message)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are require!" })
        const postdata = await dynamicPostSchema.create({
            ...reqBody
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Post created successfully", responseResult: postdata })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.findPostList = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })

        const postdata = await dynamicPostSchema.find({}).populate('user_id')
        let postArray = []
        if (postdata.length >= 0) {
            for (let i of postdata) {

                const likedata = await likeModel.find({ post_id: i._id }).populate('like_by_user')
                const commentdata = await commentModel.find({ post_id: i._id }).populate('comment_by_user')
                const reportedPost = await reportModel.find({ post_id: i._id }).populate('reported_user_id')
                const reported = await reportModel.find({ post_id: i._id }).populate('reported_user_id')
                const reportLength = reported.length
                let commentRelatedData = [];
                for (let j of commentdata) {
                    const comment = j;
                    const commentLike = await likeCommentModel.find({ comment_id: j._id }).populate('like_by_user_id')
                    const replyComment = await commentReplyModel.find({ comment_id: j._id }).populate('reply_to_user_id')
                    let replyRelatedData = [];
                    for (let k of replyComment) {
                        const replyLike = await likeReplyModel.find({ reply_id: k._id }).populate('like_by_user_id')
                        const subReply = await replyToReplyModel.find({ reply_id: k._id }).populate('reply_to_user_id')
                        let subReplyData = [];
                        for (let m of subReply) {
                            const subReplyLike = await replyToReplyLikeModel.find({ subReply_id: m._id }).populate('user_id').populate('like_to_user_id');
                            let subreplyLikeArray = {
                                subreply: m,
                                subReply: subReplyLike
                            }
                            subReplyData.push(subreplyLikeArray)


                            let replyArray = {
                                reply: k,
                                replyLike: replyLike,
                                subReplyData: subReplyData
                            }
                            replyRelatedData.push(replyArray);
                        }
                    }
                    let commentArray = {
                        comment: j,
                        commentLike: commentLike,
                        replyRelatedData: replyRelatedData
                    }
                    commentRelatedData.push(commentArray);
                }

                let arraydata = {
                    post: i,
                    likes: likedata,
                    // comments: commentdata,
                    reportedPost: reportedPost,
                    reportedPostCount: reportLength,
                    comments: commentRelatedData,

                }
                postArray.push(arraydata)
            }
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postArray), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Post list get successfully", responseResult: ciphertext })

        }
        else {
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postArray), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return res.send({ responseCode: 200, success: false, responseMessage: "There is no post", responseResult: ciphertext })
        }
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.findUserReportList = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const reportdata = await reportModel.find({ post_id: null }).populate('user_id').populate('reported_user_id');

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(reportdata), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "Report list get successfully", responseResult: ciphertext })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.findPostReportList = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        let postData = [];
        const reportdata = await reportModel.find({}).populate('post_id').populate('user_id');

        for (let i = 0; i < reportdata.length; i++) {
            if (reportdata[i].post_id != null) {
                postData.push(reportdata[i]);
            }
        }
        // console.log("datatjhgjhg", postData)
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postData), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "Post list get successfully", responseResult: ciphertext })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}


exports.inActiveUser = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const inactive = await userModel.find({ $and: [{ isOnline: true }, { is_deleted: false }, { isBlocked: false }] })
        if (!inactive)
            return res.send({ responseCode: 200, success: false, responseMessage: "User not found" })

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(inactive), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "InActive user get successfully!", responseResult: ciphertext })

    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}

// exports.deletedPost = async (req, res) => {
//     try {
//         const user = req.user;
//         const id = user._id;
//         const data = await adminModel.findOne({ _id: id })
//         if (!data)
//             return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
//         const postData = await dynamicPostSchema.find({ is_deleted: true }).populate('user_id')

//         var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postData), 'secret key 123').toString();
//         var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
//         var originalText = bytes.toString(CryptoJS.enc.Utf8);

//         return res.send({ responseCode: 200, success: true, responseMessage: "Deleted post get successfully", responseResult: ciphertext })
//     }
//     catch (error) {
//         return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
//     }
// }


exports.updateUser = async (req, res) => {
    try {
        const reqBody = req.body
        const { userId } = reqBody
        if (!userId)
            return res.send({ responseCode: 200, success: false, responseMessage: "userId is required!" })
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const userData = await userModel.findOneAndUpdate(
            { $and: [{ _id: userId }, { is_deleted: true }] },
            {
                $set: {
                    is_deleted: false,
                },
            },
            { new: true }
        )

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(userData), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "User update successfully", responseResult: ciphertext })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
    }
}


exports.updatePost = async (req, res) => {
    try {
        const reqBody = req.body
        const { postId } = reqBody
        if (!postId)
            return res.send({ responseCode: 200, success: false, responseMessage: "postId is required!" })
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })
        const postUpdate = await dynamicPostSchema.findOneAndUpdate(
            { $and: [{ _id: postId }, { is_deleted: true }] },
            {
                $set: {
                    is_deleted: false,
                },
            },
            { new: true })

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postUpdate), 'secret key 123').toString();
        var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.send({ responseCode: 200, success: true, responseMessage: "Post update successfully", responseResult: ciphertext })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
    }
}

// Uing aggregate
exports.PostList = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const data = await adminModel.findOne({ _id: id })
        if (!data)
            return res.send({ responseCode: 200, success: false, responseMessage: "Admin not found!" })

        const postdata = await dynamicPostSchema.find({}).populate('user_id')
        let postArray = []
        if (postdata.length >= 0) {
            for (let i of postdata) {

                const likedata = await likeModel.find({ post_id: i._id }).populate('like_by_user')
                const commentdata = await commentModel.find({ post_id: i._id }).populate('comment_by_user')

                // const reportedPost = await reportModel.find({ post_id: i._id }).populate('reported_user_id')
                // const reported = await reportModel.find({ post_id: i._id }).populate('reported_user_id')
                // const reportLength = reported.length
                let commentRelatedData = [];

                for (let j of commentdata) {
                    const comment = j;
                    const commentLike = await likeCommentModel.find({ comment_id: j._id }).populate('like_by_user_id')
                    const replyComment = await commentReplyModel.find({ comment_id: j._id }).populate('reply_to_user_id')
                    let replyRelatedData = [];
                    for (let k of replyComment) {
                        const replyLike = await likeReplyModel.find({ reply_id: k._id }).populate('like_by_user_id')
                        const subReply = await replyToReplyModel.find({ reply_id: j._id }).populate('reply_to_user_id')
                        replyRelatedData.push({ replyLike: replyLike }, { subReply: subReply })

                        commentRelatedData.push({ comment: comment, commentLike: commentLike });
                    }
                }

                let arraydata = {
                    post: i,
                    likes: likedata,
                    comments: commentdata,
                    // reportedPost: reportedPost,
                    // reportedPostCount: reportLength,
                    comment: commentRelatedData,

                }
                postArray.push(arraydata)
            }
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postArray), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);

            return res.send({ responseCode: 200, success: true, responseMessage: "Post list get successfully", responseResult: postArray })

        }
        else {
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(postArray), 'secret key 123').toString();
            var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            return res.send({ responseCode: 200, success: false, responseMessage: "There is no post", responseResult: ciphertext })
        }
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}