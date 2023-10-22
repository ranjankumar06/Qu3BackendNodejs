const express = require("express");
const adminController = require("../controllers/adminController");
const bodyParser = require("body-parser");
const auth = require("../middleware/validateTokenHandler")
const router = express.Router();


// Admin login
router.post("/login", adminController.adminLogin)

// User list
router.get("/userlist", auth, adminController.userList)

// User delete
router.post("/delete/user", auth, adminController.deleteUser)

// Block user
router.post("/block/user", auth, adminController.blockUser)

// Active user
router.get("/active/user", auth, adminController.activeUser)
router.get("/inactive/user", auth, adminController.inActiveUser)

// Block user list
router.get("/block/user", auth, adminController.blockList)
router.get("/deletedPost", auth, adminController.deletedPostList)

// Specific user profile
router.post("/specific/profile", auth, adminController.specificUserProfile)

// User notify
router.post("/notify/user", auth, adminController.notifyUser)

// CMS
router.post("/terms/conditions", auth, adminController.termsCondition)
router.post("/update/cms", auth, adminController.updateCms)
router.get("/cmsList", auth, adminController.findCmsdata)


// Create post
router.post("/create/post", adminController.postCreate)
router.get("/postList", auth, adminController.findPostList)

// Report delete
router.post("/delete/user/report", auth, adminController.reportDelete)
router.post("/delete/post/report", auth, adminController.postReportDelete)

// Reported userList or postList
router.get("/user/reportList", auth, adminController.findUserReportList)
router.get("/post/reportList", auth, adminController.findPostReportList)

// delete post list
// router.get("/deletePost", auth, adminController.deletedPost)

// userUpdate
router.post("/userUpdate", auth, adminController.updateUser)
// postUpdate
router.post("/postUpdate", auth, adminController.updatePost)

// Uing aggregate
router.get("/allPostList", auth, adminController.PostList)

module.exports = router;
