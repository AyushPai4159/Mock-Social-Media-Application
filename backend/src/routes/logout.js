const express = require('express');
const router = express.Router();
const { getUserForAuth } = require('../db_ops/user_ops/get_user');


// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ success: true });
    });
});



module.exports = router;