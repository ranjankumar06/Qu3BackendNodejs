const express = require("express");
const blockController = require("../controllers/blockController");
const bodyParser = require("body-parser");
const auth = require("../middleware/validateTokenHandler")
const router = express.Router();

router.post("/user/block", blockController.blockUser)


module.exports = router;
