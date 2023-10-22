const express = require("express");
const likeCommentController = require("../controllers/likeCommentController");
const bodyParser = require("body-parser");
const auth = require("../middleware/validateTokenHandler")
const router = express.Router();

router.post("/comment/like", likeCommentController.likeComment)
router.post("/like/reply", likeCommentController.likeReplyOnComment)
router.post("/comment/reply", likeCommentController.commentReply)


module.exports = router;
