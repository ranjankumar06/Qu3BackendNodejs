const followingModel = require("../models/followingModel")
const followModel = require("../models/followModel")

// following

exports.following = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, following_id, following_status, following_date, unfollowing_date } = reqBody
        if (!user_id && !following_id && !following_status && !following_date && !unfollowing_date)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are require!" })
        const following = await followingModel.create({
            ...reqBody
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "User following successfully", responseResult: following })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}

// follow

exports.follow = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, follower_id, follow_status, notification_seen, follow_date, unfollow_date } = reqBody
        if (!user_id && !follower_id && !follow_status && !notification_seen && !follow_date && !unfollow_date)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required!" })
        const followdata = await followModel.create({
            ...reqBody
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Follow successfully", responseResult: followdata })

    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
    }
}