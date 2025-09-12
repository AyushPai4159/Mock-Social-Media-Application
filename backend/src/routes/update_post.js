const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updatePost } = require('../db_ops/post_ops/update_post');

router.put('/:postId', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const updatedPost = await updatePost(req.params.postId, req.session.userId, content);
        
        if (updatedPost) {
            res.json(updatedPost);
        } else {
            res.status(403).json({ error: 'Not authorized to edit this post' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

module.exports = router;