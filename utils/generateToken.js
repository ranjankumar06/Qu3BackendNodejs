const jwt = require('jsonwebtoken');
const userTokenModel = require('../models/userTokenModel.js');

const generateTokens = async (user) => {
    try {

        const payload = {
            _id: user._id,
            roles: user.roles
        };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const userToken = await userTokenModel.findOneAndRemove({ userId: user._id });
        // console.log("user...", userToken);
       
            await new userTokenModel({ userId: user._id, token: refreshToken }).save();
            return Promise.resolve({ accessToken, refreshToken });

    }
    catch (err) {
        return Promise.reject(err);
    }
};


module.exports =  generateTokens ;