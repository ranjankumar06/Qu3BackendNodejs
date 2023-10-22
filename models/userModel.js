const mongoose = require("mongoose");


const Schema = mongoose.Schema;
const userSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    profile_image: {
        type: String,
    },
    location: {
        type: String,
    },
    bio: {
        type: String,
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "super_admin"],
        default: ["user"],
    },
    date_of_birth: {
        type: String
    },
    gender: {
        type: String
    },
    is_verify: {
        type: String,
        default: 0
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    reset_password_request: {
        type: String,
    },
    on_boarding: {
        type: Boolean
    },
    registration_process: {
        type: String
    },
    socket_id: {
        type: String
    },
    isOnline: {
        type: Boolean
    },
    verification_code: {
        type: String
    },
    socialLoginId: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    
    isBlocked: {
        type: Boolean,
        default: false
    },

    QR: [{
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        timestamp: {
            type: String
        },
        post_id: {
            type: Schema.Types.ObjectId,
            ref: "post"
        },
        scan_count: {
            type: Number,
            default: 0
        }
    }]
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);
