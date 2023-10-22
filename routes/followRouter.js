const express = require("express");
const followController = require("../controllers/followController");
const bodyParser = require("body-parser");
const auth = require("../middleware/validateTokenHandler")
const router = express.Router();

router.post("/user/following", followController.following)
router.post("/user/follow", followController.follow)


module.exports = router;
