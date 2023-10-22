const express = require("express");
const commentReplyController = require("../controllers/commentReplyController");
const bodyParser = require("body-parser");
const auth = require("../middleware/validateTokenHandler")
const router = express.Router();

router.post("/reply", commentReplyController.commentReply)
router.post("/user/comment", commentReplyController.comment)
router.post("/replyToReply",commentReplyController.replyToReply)
module.exports = router;
