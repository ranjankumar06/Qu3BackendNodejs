const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingSchema = new Schema({
    user_id: {
        type:Schema.Types.ObjectId,
        required: true
    },
    notification: {
        type: Boolean
    },
    location: {
        type: Boolean
    },

}, {timestamps: true});

// const userToken = mongoose.model("userToken", userTokenSchema);

module.exports = mongoose.model("Setting", settingSchema);
