const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');  // Our auth middleware
const { addPost } = require('../db_ops/post_ops/add_post');

// Create new post
router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const postId = await addPost(req.session.userId, content);
        res.json({ postId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

module.exports = router;
