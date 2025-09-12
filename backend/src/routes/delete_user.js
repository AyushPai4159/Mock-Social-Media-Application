const express = require('express');
const router = express.Router();
const { deleteUser } = require('../db_ops/user_ops/delete_user');

// Delete user route
router.delete('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const success = await deleteUser(userId);
        
        if (success) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;