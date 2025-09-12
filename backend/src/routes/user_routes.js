const express = require('express');
const router = express.Router();
const { addUser, deleteUser } = require('../db_ops/user_ops/user_ops');
const bcrypt = require('bcrypt');

// Create user route
router.post('/create', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await addUser(username, email, hashedPassword);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});

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