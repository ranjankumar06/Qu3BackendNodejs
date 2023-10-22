const mongoose = require("mongoose");
const moment = require('moment');
const year = moment().format('YYYY');

const Schema = mongoose.Schema;
const reportSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    post_id: {
        type: Schema.Types.ObjectId,
        ref: "post"+year ,
        default: null
    },
    reported_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reported_date: {
        type: Date
    },
    description:{
        type: String
    },
    status: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });


module.exports = mongoose.model("Report", reportSchema);
