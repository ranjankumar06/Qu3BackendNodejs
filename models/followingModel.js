const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followingSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    following_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    following_status: {
        type: Boolean
    },
    following_date: {
        type: Date
    },
    unfollowing_date: {
        type: Date
    }

}, { timestamps: true });

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("following", followingSchema);