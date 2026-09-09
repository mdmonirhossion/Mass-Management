const Member = require('../models/Member');

// Get all non-deleted members
exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find({ isDeleted: false });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching members', error: error.message });
    }
};

// Add a new member
exports.addMember = async (req, res) => {
    try {
        const { name, room } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Member name is required' });
        }

        const existingMember = await Member.findOne({ name: name.trim(), isDeleted: false });
        if (existingMember) {
            return res.status(400).json({ message: 'Member already exists' });
        }

        const member = new Member({
            name: name.trim(),
            room: room ? room.trim() : 'Not Assigned'
        });

        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: 'Error adding member', error: error.message });
    }
};

// Soft delete a member
exports.deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        member.isDeleted = true;
        await member.save();

        res.json({ message: 'Member deleted successfully', id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting member', error: error.message });
    }
};
