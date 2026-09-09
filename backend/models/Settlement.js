const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
    member: {
        type: String,
        required: true,
        trim: true
    },
    month: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: String,
        default: 'Settled'
    },
    settledAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settlement', settlementSchema, 'Settlement');
