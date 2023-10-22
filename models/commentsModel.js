const mongoose = require("mongoose");
const moment = require('moment');
const year = moment().format('YYYY');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref:"post"+year
    },
    comment_by_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    comment: {
        type: String,
    },
    comment_notification: {
        type: Boolean,
        default: false

    },
    comment_status: {
        type: Boolean,
        default: false

    }


}, { timestamps: true });

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("Comment", commentSchema);