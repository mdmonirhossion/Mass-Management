const Bazar = require('../models/Bazar');

// Get bazar entries for a month
exports.getBazar = async (req, res) => {
    try {
        const month = req.query.month || 'September 2026';
        const bazarEntries = await Bazar.find({ month }).sort({ createdAt: -1 });
        res.json(bazarEntries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bazar data', error: error.message });
    }
};

// Add new bazar entry
exports.addBazar = async (req, res) => {
    try {
        const { date, member, items, amount, month } = req.body;
        if (!date || !member || !items || !amount || !month) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const bazar = new Bazar({
            date,
            member,
            items: items.trim(),
            amount: Number(amount),
            month
        });

        await bazar.save();
        res.status(201).json(bazar);
    } catch (error) {
        res.status(500).json({ message: 'Error adding bazar entry', error: error.message });
    }
};

// Update bazar entry
exports.updateBazar = async (req, res) => {
    try {
        const { id } = req.params;
        const { items, amount } = req.body;

        const bazar = await Bazar.findById(id);
        if (!bazar) {
            return res.status(404).json({ message: 'Bazar entry not found' });
        }

        if (items) bazar.items = items.trim();
        if (amount !== undefined) bazar.amount = Number(amount);

        await bazar.save();
        res.json(bazar);
    } catch (error) {
        res.status(500).json({ message: 'Error updating bazar entry', error: error.message });
    }
};

// Delete bazar entry
exports.deleteBazar = async (req, res) => {
    try {
        const { id } = req.params;
        const bazar = await Bazar.findByIdAndDelete(id);
        if (!bazar) {
            return res.status(404).json({ message: 'Bazar entry not found' });
        }
        res.json({ message: 'Bazar entry deleted successfully', id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting bazar entry', error: error.message });
    }
};
