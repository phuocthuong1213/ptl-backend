const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            unique: true,
            index: true,
            lowercase: true
        },
        firstname: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        lastname: {
            type: String,
            trim: true,
            required: true,
            max: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        profile: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        roleType: {
            type: String,
            default: ''
        },
        avatar: {
            data: Buffer,
            contentType: String
        },
        resetPasswordLink: {
            data: String,
            default: ''
        },
        token: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);
