const reportModel = require("../models/reportModel")

const moment = require('moment');
exports.createReport = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, reported_user_id, post_id, description } = reqBody
        if (!user_id || !description)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are require!" })
        const reportdata = await reportModel.create({
            ...reqBody,
            reported_date: moment()
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Report created successfully", responseResult: reportdata })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}