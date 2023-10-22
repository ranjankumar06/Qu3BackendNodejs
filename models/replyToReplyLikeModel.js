const mongoose = require("mongoose");
const moment = require('moment');
const year = moment().format('YYYY');
const Schema = mongoose.Schema;

const subReplyLikeSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    like_to_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    subReply_id: {
        type: Schema.Types.ObjectId,
        ref: "ReplyToReply",
    },
    reply_notification: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("ReplyToReplyLike", subReplyLikeSchema);