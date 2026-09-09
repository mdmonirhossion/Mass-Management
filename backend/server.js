const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Member = require('./models/Member');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auto-seed default members if DB is empty
const seedDefaultMembers = async () => {
    try {
        const count = await Member.countDocuments({ isDeleted: false });
        if (count === 0) {
            const defaultMembers = [
                { name: "Wohid", room: "Room 101" },
                { name: "Bebak", room: "Room 102" },
                { name: "Rahul", room: "Room 103" },
                { name: "Tanzil", room: "Room 104" },
                { name: "Monir", room: "Room 105" },
                { name: "Orko", room: "Room 106" },
                { name: "Roddur", room: "Room 107" }
            ];
            await Member.insertMany(defaultMembers);
            console.log("Default mess members seeded successfully!");
        }
    } catch (err) {
        console.error("Error seeding default members:", err.message);
    }
};

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/bazar', require('./routes/bazarRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/settlements', require('./routes/settlementRoutes'));
app.use('/api/summary', require('./routes/summaryRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Mess Management API is running smoothly' });
});

const PORT = process.env.PORT || 5000;

// Connect to Database first, then start listening
connectDB()
    .then(async () => {
        await seedDefaultMembers();
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server due to DB connection error:", err.message);
    });
