const express = require("express");
const reportController = require("../controllers/reportController");
const bodyParser = require("body-parser");
const auth = require("../middleware/validateTokenHandler")
const router = express.Router();

router.post("/user/report", reportController.createReport)


module.exports = router;
