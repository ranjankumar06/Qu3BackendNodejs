const likeModel = require("../models/likeModel")
const subReplyLikeSchema=require("../models/replyToReplyLikeModel")

exports.likeCreate = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, post_id, likes_count, like_by_user, like_notification } = reqBody
        if (!user_id && !post_id && !likes_count && !like_by_user && !like_notification)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are require!" })
        const likedata = await likeModel.create({
            ...reqBody
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Like created successfully", responseResult: likedata })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}

exports.likeToSubLike = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, like_to_user_id, subReply_id,  } = reqBody
        if (!user_id || !like_to_user_id || !subReply_id )
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are require!" })
        const likedata = await subReplyLikeSchema.create({
            ...reqBody
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "sub like created successfully", responseResult: likedata })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })
    }
}
