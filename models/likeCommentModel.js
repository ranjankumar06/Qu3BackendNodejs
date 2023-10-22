const mongoose = require("mongoose");
const moment = require('moment');
const year = moment().format('YYYY');
const Schema = mongoose.Schema;

const likeCommentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "post" + year,
    },
    like_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    comment_id: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    like_notification: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("LikeComment", likeCommentSchema);