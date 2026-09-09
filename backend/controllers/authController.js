const User = require('../models/User');

// Register a General Member via Gmail / Email
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Gmail / Email is required' });
        }
        if (!password || password.trim().length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters long' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this Gmail/Email already registered' });
        }

        // Create new General Member (default with edit access for meals and bazar)
        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            username: normalizedEmail.split('@')[0],
            password: password.trim(),
            role: 'member',
            isGranted: true // General members registering get edit access to daily meals & bazar
        });

        await user.save();

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            isGranted: user.isGranted,
            message: 'Registration successful! You now have Edit access to Daily Meals & Bazar.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering member', error: error.message });
    }
};

// Login for Main Manager (Admin) & General Members
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username/Email and Password are required' });
        }

        const inputKey = username.trim().toLowerCase();

        // 1. Check Main Manager / Admin credentials (Fixed admin account)
        if ((inputKey === 'admin' || inputKey === 'admin@mess.com' || inputKey === 'manager') && password.trim() === 'admin123') {
            return res.json({
                id: 'admin-001',
                username: 'admin',
                name: 'Main Manager (Admin)',
                email: 'admin@mess.com',
                role: 'admin',
                isGranted: true,
                message: 'Welcome Main Manager! You have full administrative control.'
            });
        }

        // 2. Check Database for registered member
        const user = await User.findOne({
            $or: [{ email: inputKey }, { username: inputKey }]
        });

        if (user && user.password === password.trim()) {
            return res.json({
                id: user._id,
                username: user.username || user.email,
                name: user.name,
                email: user.email,
                role: user.role,
                isGranted: user.isGranted,
                message: `Welcome ${user.name}!`
            });
        }

        // 3. Demo Account Fallback Handling
        if (inputKey === 'member' && password.trim() === 'member123') {
            return res.json({
                id: 'demo-member-1',
                username: 'member',
                name: 'General Member (Granted)',
                email: 'member@mess.com',
                role: 'member',
                isGranted: true,
                message: 'Welcome Demo Member! Edit access granted.'
            });
        }

        if (inputKey === 'viewer' && password.trim() === 'viewer123') {
            return res.json({
                id: 'demo-viewer-1',
                username: 'viewer',
                name: 'General Member (Read-Only)',
                email: 'viewer@mess.com',
                role: 'member',
                isGranted: false,
                message: 'Welcome Demo Viewer! Read-only access.'
            });
        }

        return res.status(401).json({ message: 'Invalid Username/Email or Password. (For Manager use admin / admin123)' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get all registered users (for Manager)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Update user granted permission (Manager only)
exports.togglePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { isGranted } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isGranted = Boolean(isGranted);
        await user.save();

        res.json({ id: user._id, name: user.name, isGranted: user.isGranted });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user permission', error: error.message });
    }
};
