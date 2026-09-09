const mongoose = require('mongoose');

const bazarSchema = new mongoose.Schema({
    member: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    items: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    month: {
        type: String,
        required: true,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bazar', bazarSchema, 'Bazar');
