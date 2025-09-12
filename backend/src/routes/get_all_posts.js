const express = require('express');
const router = express.Router();
const { getAllPosts } = require('../db_ops/post_ops/get_post');
const auth = require('../middleware/auth');  // Our auth middleware

// Get all posts for main feed (needs auth)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

module.exports = router;



