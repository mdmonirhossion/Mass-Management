const Settlement = require('../models/Settlement');

// Get settlements for a month
exports.getSettlements = async (req, res) => {
    try {
        const month = req.query.month || 'September 2026';
        const settlements = await Settlement.find({ month });
        res.json(settlements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settlements', error: error.message });
    }
};

// Toggle or mark settlement status
exports.settleMember = async (req, res) => {
    try {
        const { member, month } = req.body;
        if (!member || !month) {
            return res.status(400).json({ message: 'Member and month are required' });
        }

        let settlement = await Settlement.findOne({ member, month });
        if (settlement) {
            settlement.status = 'Settled';
            settlement.settledAt = new Date();
            await settlement.save();
        } else {
            settlement = new Settlement({
                member,
                month,
                status: 'Settled',
                settledAt: new Date()
            });
            await settlement.save();
        }

        res.json(settlement);
    } catch (error) {
        res.status(500).json({ message: 'Error marking settlement', error: error.message });
    }
};
