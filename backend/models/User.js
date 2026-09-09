const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
    },
    isGranted: {
        type: Boolean,
        default: true // Registered general members get edit access to daily meals & bazar
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema, 'User');
