const likeCommentModel = require("../models/likeCommentModel")
const likeReply = require("../models/likeReplyModel")
const commentReplyModel = require("../models/commentReplyModel")


exports.likeComment = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, post_id, like_by_user_id, comment_id, like_notification } = reqBody

        if (!user_id || !post_id || !like_by_user_id || !comment_id || !like_notification)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required!" })

        const cretaeCommentLike = await likeCommentModel.create({
            ...reqBody
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Comment like create successfully", responseResult: cretaeCommentLike })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
    }
}


exports.likeReplyOnComment = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, post_id, like_by_user_id, reply_id } = reqBody
        if (!user_id || !post_id || !like_by_user_id || !reply_id)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are require!" })
        const likedata = await likeReply.create({
            ...reqBody
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Like created successfully", responseResult: likedata })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong!", responseResult: error.message })

    }
}

exports.commentReply = async (req, res) => {
    try {
        const reqBody = req.body
        const { user_id, post_id, comment_id, reply_to_user_id, reply } = reqBody

        if (!user_id || !post_id || !comment_id || !reply_to_user_id || !reply)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required!" })

        const createLike = await commentReplyModel.create({
            ...reqBody
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Like create successfully", responseResult: createLike })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
    }
}