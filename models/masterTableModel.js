const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const masterTableSchema = new Schema({
    post_table_name: {
        type: String
    },
    from: {
        type: Number
    },
    to: {
        type: Number
    },
    status: {
        type: Boolean
    }
}, { timestamps: true });


module.exports = mongoose.model("MasterTable", masterTableSchema);
