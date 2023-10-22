const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const blockSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    block_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    blocked_date: {
        type: Date
    },
    unblocked_date: {
        type: Date
    },
    block_count: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean
    }
}, { timestamps: true });


module.exports = mongoose.model("Block", blockSchema);
