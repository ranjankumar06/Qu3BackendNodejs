const express = require("express");
const likeController = require("../controllers/likeController");
const bodyParser = require("body-parser");
const auth = require("../middleware/validateTokenHandler")
const router = express.Router();

router.post("/like/create", likeController.likeCreate)

router.post("/likeToSubLike", likeController.likeToSubLike)

module.exports = router;
