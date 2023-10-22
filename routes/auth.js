const express = require('express');
const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const { Router } = require("express");
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const userController = require('../controllers/userController.js');
const jwt = require("jsonwebtoken");
const verifyRefreshToken = require("../utils/verifyRefreshToken.js");
const { refreshTokenBodyValidation } = require("../utils/validationSchema.js");
const validateToken = require("../middleware/auth.js");
const multer = require('multer')
const fileExtension = require("file-extension")
const path = require("path")
const bodyParser = require("body-parser");
const user = express()

user.use(express.json());
user.use(bodyParser.json({ limit: '50mb' }));
user.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


const router = Router();

const storage = multer.diskStorage({
  destination: '../uploads',
  filename: function (_req, file, cb) {

    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
console.log(storage);
var upload = multer({
  storage: storage,
  limits: {
    fields: 11,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 20000, //TODO: Check if this size is enough
    // TODO: Change this line after compression
    fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
  },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  }
}).single('profile_image');
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const multerStorage = multer({ storage: storage });

// Sign Up
router.post("/user/register", upload, userController.registerUser);

// handle email
router.post("/user/unique/email", userController.handleEmail);

// handle username
router.post("/user/unique/username", userController.handleusername);

// unregister user
router.post("/user/unregister", userController.unRegisterUser);

// Login
router.post("/user/login", userController.loginUser);

// get new Token
router.post("/user/refresh/token", userController.newToken);

// Verify User
router.get("/auth/user/verify", userController.verifyUser);

// Logout
router.post("/user/logout", userController.logout);

// get User Profile
router.get("/user/profile", validateToken, userController.getUserProfile);

// Update profile
router.post("/user/profile/update", validateToken, upload, userController.updateProfile);

// Delete user
router.post("/user/delete", validateToken, userController.deleteUser);

//forget Password send reset link
router.post("/user/forget/password", userController.forgetPassword);

// Hbs page link
router.get("/email/:id", userController.email);

// reset password by hbs page
router.post("/email/:id", userController.resetPassword)

// generated code for QR 
router.post("/user/generate/code/qr", validateToken, userController.generateQrForUser)

// save Post with QR
router.post("/user/save/qr/post", validateToken, userController.addPostToQr)

// upload file
router.post('/save/file', multerStorage.single("file"), userController.uploadFile);

router.get("/video", userController.getVideo)



module.exports = router;
