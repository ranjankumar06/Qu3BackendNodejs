const mongoose = require("mongoose");
const moment = require('moment');
const year = moment().format('YYYY');
const Schema = mongoose.Schema;

const subReplySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref:"post"+year
    },
    reply_to_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reply_id: {
        type: Schema.Types.ObjectId,
        ref: "Reply",
    },
    reply_notification: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("ReplyToReply", subReplySchema);