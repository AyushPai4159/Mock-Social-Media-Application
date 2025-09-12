const express = require('express');
const router = express.Router();
const { addLike } = require('../db_ops/like_ops/like_post');
const { removeLike } = require('../db_ops/like_ops/unlike_post');
const auth = require('../middleware/auth');

// Like a post
router.post('/:postId/like', auth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const success = await addLike(postId, req.session.userId);
        
        if (success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Already liked' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to like post' });
    }
});

// Unlike a post
router.delete('/:postId/like', auth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const success = await removeLike(postId, req.session.userId);
        
        if (success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Post not liked' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to unlike post' });
    }
});

module.exports = router;