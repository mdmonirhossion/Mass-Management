const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    member: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    breakfast: {
        type: Number,
        default: 0
    },
    lunch: {
        type: Number,
        default: 0
    },
    dinner: {
        type: Number,
        default: 0
    },
    month: {
        type: String,
        required: true,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meal', mealSchema, 'Meal');
