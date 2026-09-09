const Meal = require('../models/Meal');

// Get meals for a specific month
exports.getMeals = async (req, res) => {
    try {
        const month = req.query.month || 'September 2026';
        const meals = await Meal.find({ month });
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meals', error: error.message });
    }
};

// Save or update meals for a specific month
exports.saveMeals = async (req, res) => {
    try {
        const { month, meals, date } = req.body;
        if (!month || !Array.isArray(meals)) {
            return res.status(400).json({ message: 'Month and meals array are required' });
        }

        const mealDate = date || new Date().toISOString().split('T')[0];

        // Process each member meal entry
        const savedMeals = [];
        for (const item of meals) {
            const { member, breakfast, lunch, dinner } = item;
            if (!member) continue;

            const existingMeal = await Meal.findOne({ member, month });
            if (existingMeal) {
                existingMeal.breakfast = Number(breakfast) || 0;
                existingMeal.lunch = Number(lunch) || 0;
                existingMeal.dinner = Number(dinner) || 0;
                existingMeal.date = mealDate;
                await existingMeal.save();
                savedMeals.push(existingMeal);
            } else {
                const newMeal = new Meal({
                    member,
                    month,
                    date: mealDate,
                    breakfast: Number(breakfast) || 0,
                    lunch: Number(lunch) || 0,
                    dinner: Number(dinner) || 0
                });
                await newMeal.save();
                savedMeals.push(newMeal);
            }
        }

        res.json({ message: 'Meals saved successfully', meals: savedMeals });
    } catch (error) {
        res.status(500).json({ message: 'Error saving meals', error: error.message });
    }
};
