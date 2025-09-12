const express = require('express');
const router = express.Router();
const { getUserForAuth } = require('../db_ops/user_ops/get_user');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userId = await getUserForAuth(username, password);
        
        if (userId) {
            // Store userId in session
            req.session.userId = userId;
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});


module.exports = router;


