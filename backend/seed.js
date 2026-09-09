const mongoose = require('mongoose');
require('dotenv').config();

const Member = require('./models/Member');
const Meal = require('./models/Meal');
const Bazar = require('./models/Bazar');
const MonthlyBill = require('./models/MonthlyBill');
const Settlement = require('./models/Settlement');

const defaultMembers = [
    { name: "Wohid", room: "Room 101" },
    { name: "Bebak", room: "Room 102" },
    { name: "Rahul", room: "Room 103" },
    { name: "Tanzil", room: "Room 104" },
    { name: "Monir", room: "Room 105" },
    { name: "Orko", room: "Room 106" },
    { name: "Roddur", room: "Room 107" }
];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected successfully to database: ${mongoose.connection.name}`);

        const currentMonth = 'September 2026';

        // Clear existing collections to ensure clean data for the exact mess members
        console.log('Clearing old collections for a clean setup...');
        await Member.deleteMany({});
        await Meal.deleteMany({});
        await Bazar.deleteMany({});
        await MonthlyBill.deleteMany({});
        await Settlement.deleteMany({});

        // 1. Seed Members
        console.log('Seeding Mess Members...');
        await Member.insertMany(defaultMembers);
        console.log('7 Mess Members seeded successfully: Wohid, Bebak, Rahul, Tanzil, Monir, Orko, Roddur');

        // 2. Seed Initial Meals for all 7 members
        console.log('Seeding initial Meals...');
        const initialMeals = defaultMembers.map(m => ({
            member: m.name,
            date: '2026-09-01',
            breakfast: 1,
            lunch: 1,
            dinner: 1,
            month: currentMonth
        }));
        await Meal.insertMany(initialMeals);
        console.log('Initial Meals seeded.');

        // 3. Seed Initial Bazar entries for members
        console.log('Seeding initial Bazar entries...');
        await Bazar.insertMany([
            { member: 'Wohid', date: '2026-09-01', items: 'Rice, Cooking Oil, Chicken', amount: 2500, month: currentMonth },
            { member: 'Bebak', date: '2026-09-03', items: 'Fish, Vegetables, Spices', amount: 1800, month: currentMonth },
            { member: 'Rahul', date: '2026-09-06', items: 'Lentils, Eggs, Onions, Potato', amount: 1200, month: currentMonth }
        ]);
        console.log('Bazar entries seeded.');

        // 4. Seed Monthly Utility Bills
        console.log('Seeding Monthly Bills...');
        await MonthlyBill.insertMany([
            { name: 'WiFi Internet Bill', amount: 1000, month: currentMonth },
            { name: 'Gas & Electricity Bill', amount: 2100, month: currentMonth },
            { name: 'House Maid & Cleaner', amount: 3500, month: currentMonth }
        ]);
        console.log('Monthly Bills seeded.');

        // 5. Seed Initial Settlement status
        console.log('Seeding Initial Settlements...');
        await Settlement.insertMany([
            { member: 'Wohid', month: currentMonth, status: 'Settled' }
        ]);
        console.log('Settlement status seeded.');

        console.log('\nSUCCESS! All database collections & mess members updated in MongoDB Atlas!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
}

seedDatabase();
