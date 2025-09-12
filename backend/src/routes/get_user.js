const express = require('express');
const router = express.Router();
const { getUserById } = require('../db_ops/user_ops/get_user');
const auth = require('../middleware/auth');

// Get current user's info
router.get('/me', auth, async (req, res) => {
    try {
        const user = await getUserById(req.session.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Error getting user info' });
    }
});

module.exports = router;