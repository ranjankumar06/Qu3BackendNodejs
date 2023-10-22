const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
    {

        termsAndConditions: {
            type: String
        },
        privacyPolicy: {
            type: String
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model("cms", cmsSchema);