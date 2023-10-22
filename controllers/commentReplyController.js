const commentReplyModel = require("../models/commentReplyModel")
const commentModel = require("../models/commentsModel")
const replyToReplyModel=require("../models/replyToReplyModel")
// comment on reply

exports.commentReply = async (req, res) => {
    try {
        const reqBody = req.body;
        const { user_id, post_id, comment_id, reply_to_user_id, reply, reply_notification, reply_status } = reqBody;

        if (!user_id && !post_id && !comment_id && !reply_to_user_id && !reply && !reply_notification && !reply_status)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required !" })

        const commentdata = await commentReplyModel.create({
            user_id,
            post_id,
            comment_id,
            reply_to_user_id,
            reply,
            reply_notification,
            reply_status
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Reply on comment successfully", responseResult: commentdata })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
    }
}


// comment

exports.comment = async (req, res) => {
    try {
        const reqBody = req.body;
        const { user_id, post_id, comment_by_user, comment, comment_notification, comment_status } = reqBody;

        if (!user_id && !post_id && !comment_by_user && !comment && !comment_notification && !comment_status)
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required !" })

        const userComment = await commentModel.create({
            user_id,
            post_id,
            comment_by_user,
            comment,
            comment_notification,
            comment_status
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Comment successfully", responseResult: userComment })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
    }
}




exports.replyToReply = async (req, res) => {
    try {
        const reqBody = req.body;
        const { user_id, post_id, reply_to_user_id, reply_id} = reqBody;

        if (!user_id || !post_id  || !reply_to_user_id || !reply_id )
            return res.send({ responseCode: 200, success: false, responseMessage: "All feilds are required !" })

        const replyToReplyData = await replyToReplyModel.create({
            user_id,
            post_id,
            reply_to_user_id,
            reply_id
        })
        return res.send({ responseCode: 200, success: true, responseMessage: "Reply to reply successfully", responseResult: replyToReplyData })
    }
    catch (error) {
        return res.send({ responseCode: 400, responseMessage: "Something went wrong", responseResult: error.message })
    }
}
