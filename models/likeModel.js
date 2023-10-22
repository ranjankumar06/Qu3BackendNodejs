const mongoose = require("mongoose");
const moment = require('moment');
const year = moment().format('YYYY');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref:"post"+year
    },
    likes_count: {
        type: Number,
        default: 0
    },
    like_by_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    like_notification: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("Like", likeSchema);