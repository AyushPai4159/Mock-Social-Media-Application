const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserStats } = require('../db_ops/procedures/get_user_stats');

router.get('/stats', auth, async (req, res) => {
    console.log('User ID from session:', req.session.userId);
    try {
        const stats = await getUserStats(req.session.userId);
        console.log('Stats returned:', stats);
        res.json(stats);
    } catch (error) {
        console.error('Error in stats route:', error);
        res.status(500).json({ error: 'Failed to get user stats' });
    }
});

module.exports = router;