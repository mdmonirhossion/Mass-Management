const Member = require('../models/Member');
const Meal = require('../models/Meal');
const Bazar = require('../models/Bazar');
const MonthlyBill = require('../models/MonthlyBill');
const Settlement = require('../models/Settlement');

exports.getSummary = async (req, res) => {
    try {
        const month = req.query.month || 'September 2026';

        // Fetch active members
        const members = await Member.find({ isDeleted: false });

        // Fetch month data
        const meals = await Meal.find({ month });
        const bazarEntries = await Bazar.find({ month });
        const monthlyBills = await MonthlyBill.find({ month });
        const settlements = await Settlement.find({ month });

        // Calculate Total Bazar
        let totalBazar = 0;
        bazarEntries.forEach(entry => {
            totalBazar += Number(entry.amount) || 0;
        });

        // Calculate Total Meals
        let totalMeal = 0;
        meals.forEach(meal => {
            totalMeal += (Number(meal.breakfast) || 0) + (Number(meal.lunch) || 0) + (Number(meal.dinner) || 0);
        });

        // Calculate Meal Rate
        const mealRate = totalMeal > 0 ? totalBazar / totalMeal : 0;

        // Calculate Monthly Bills total & per person
        let totalBillsAmount = 0;
        monthlyBills.forEach(bill => {
            totalBillsAmount += Number(bill.amount) || 0;
        });
        const billPerPerson = members.length > 0 ? Math.round(totalBillsAmount / members.length) : 0;

        // Member Summaries Breakdown
        let totalPayable = 0;
        let totalReceivable = 0;

        const memberSummaries = members.map(member => {
            // Bazar paid by this member
            let memberBazar = 0;
            bazarEntries.forEach(entry => {
                if (entry.member === member.name) {
                    memberBazar += Number(entry.amount) || 0;
                }
            });

            // Meals taken by this member
            const memberMealDoc = meals.find(m => m.member === member.name);
            const memberMeal = memberMealDoc 
                ? (Number(memberMealDoc.breakfast) || 0) + (Number(memberMealDoc.lunch) || 0) + (Number(memberMealDoc.dinner) || 0)
                : 0;

            const mealCost = memberMeal * mealRate;
            const balance = memberBazar - mealCost;

            const isSettled = settlements.some(s => s.member === member.name && s.status === 'Settled');

            let status = 'Settled';
            if (isSettled) {
                status = 'Settled';
            } else if (balance > 0) {
                status = 'Receive';
                totalReceivable += Math.round(balance);
            } else if (balance < 0) {
                status = 'Pay';
                totalPayable += Math.abs(Math.round(balance));
            }

            return {
                id: member._id,
                name: member.name,
                room: member.room,
                totalMeal: memberMeal,
                bazarPaid: memberBazar,
                mealCost: Math.round(mealCost),
                balance: Math.round(balance),
                status,
                isSettled
            };
        });

        res.json({
            month,
            totalBazar,
            totalMeal,
            mealRate: Number(mealRate.toFixed(2)),
            totalMembers: members.length,
            totalBillsAmount,
            billPerPerson,
            totalPayable,
            totalReceivable,
            memberSummaries,
            recentBazar: bazarEntries.slice(0, 5),
            monthlyBills
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating summary', error: error.message });
    }
};
