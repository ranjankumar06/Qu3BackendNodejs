const mongoose = require("mongoose");
const moment = require('moment');
const year = moment().format('YYYY');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "post" + year,
    },
    comment_id: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    reply_to_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reply: {
        type: String,
    },
    reply_notification: {
        type: Boolean,
        default: false
    },
    reply_status: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("Reply", replySchema);