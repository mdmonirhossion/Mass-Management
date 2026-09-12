const Meal = require('../models/Meal');

// Get meals for a specific month and optional date
exports.getMeals = async (req, res) => {
    try {
        const month = req.query.month || 'September 2026';
        const date = req.query.date;
        const query = { month };
        if (date) {
            query.date = date;
        }
        const meals = await Meal.find(query);
        res.json(meals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching meals', error: error.message });
    }
};

// Save or update meals for a specific month & date
exports.saveMeals = async (req, res) => {
    try {
        const { month, meals, date } = req.body;
        if (!month || !Array.isArray(meals)) {
            return res.status(400).json({ message: 'Month and meals array are required' });
        }

        const mealDate = date || new Date().toISOString().split('T')[0];

        // Process each member meal entry for the specific date
        const savedMeals = [];
        for (const item of meals) {
            const { member, breakfast, lunch, dinner } = item;
            if (!member) continue;

            const parsedBreakfast = parseFloat(breakfast) || 0;
            const parsedLunch = parseFloat(lunch) || 0;
            const parsedDinner = parseFloat(dinner) || 0;

            const existingMeal = await Meal.findOne({ member, date: mealDate, month });
            if (existingMeal) {
                existingMeal.breakfast = parsedBreakfast;
                existingMeal.lunch = parsedLunch;
                existingMeal.dinner = parsedDinner;
                await existingMeal.save();
                savedMeals.push(existingMeal);
            } else {
                const newMeal = new Meal({
                    member,
                    month,
                    date: mealDate,
                    breakfast: parsedBreakfast,
                    lunch: parsedLunch,
                    dinner: parsedDinner
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
