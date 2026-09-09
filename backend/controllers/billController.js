const MonthlyBill = require('../models/MonthlyBill');

// Get monthly bills for a month
exports.getBills = async (req, res) => {
    try {
        const month = req.query.month || 'September 2026';
        const bills = await MonthlyBill.find({ month });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching monthly bills', error: error.message });
    }
};

// Add new monthly bill
exports.addBill = async (req, res) => {
    try {
        const { name, amount, month } = req.body;
        if (!name || !amount || !month) {
            return res.status(400).json({ message: 'Name, amount and month are required' });
        }

        const bill = new MonthlyBill({
            name: name.trim(),
            amount: Number(amount),
            month
        });

        await bill.save();
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Error adding bill', error: error.message });
    }
};

// Update monthly bill
exports.updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const bill = await MonthlyBill.findById(id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        if (amount !== undefined) bill.amount = Number(amount);
        await bill.save();

        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Error updating bill', error: error.message });
    }
};

// Delete monthly bill
exports.deleteBill = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await MonthlyBill.findByIdAndDelete(id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }
        res.json({ message: 'Bill deleted successfully', id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting bill', error: error.message });
    }
};
