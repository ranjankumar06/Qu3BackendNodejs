const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    follower_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    follow_status: {
        type: Boolean,
        default:false
    },
    notification_seen: {
        type: Boolean,
        default:false
    },
    follow_date: {
        type: Date
    },
    unfollow_date: {
        type: Date
    },



}, { timestamps: true });

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("follow", followSchema);