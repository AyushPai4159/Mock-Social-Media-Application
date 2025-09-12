const express = require('express');
const router = express.Router();
const { addUser } = require('../db_ops/user_ops/add_user');

// Create user route
router.post('/create', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        await addUser(username, email, password);  // Just pass the plain password
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = router;