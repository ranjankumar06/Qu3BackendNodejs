const express = require('express');
const userTokenModel = require("../models/userTokenModel");
const jwt = require("jsonwebtoken");

const verifyRefreshToken = (refreshToken) => {
 
    const privatekey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
    return new Promise( (resolve, reject) => {

        const doc = userTokenModel.findOne({ token: refreshToken});
            if(!doc)

            return reject({ error: true, message: "Invalid refresh token !"});

            jwt.verify(refreshToken, privatekey, (err, tokenDetails) => {
                if(err)
                return reject({ error: true, message: "Invalid refresh token !"});
                resolve({
                    tokenDetails,
                    error: false,
                    message: "Valid refresh Token !",
                });

            });
        
    });

};

module.exports = verifyRefreshToken;