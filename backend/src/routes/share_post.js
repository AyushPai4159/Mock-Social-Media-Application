const express = require('express');
const router = express.Router();
const { addShare } = require('../db_ops/share_ops/add_share');
const { getUserByUsername } = require('../db_ops/user_ops/get_user');
const auth = require('../middleware/auth');

router.post('/:postId/share', auth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const { toUsername } = req.body;
        
        const toUser = await getUserByUsername(toUsername);
        if (!toUser) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (toUser.UserID === req.session.userId) {
            return res.status(400).json({ error: 'Cannot share post with yourself' });
        }

        const success = await addShare(postId, req.session.userId, toUser.UserID);
        
        if (success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Failed to share post' });
        }
    } catch (error) {
        console.error('Share error:', error);
        res.status(500).json({ error: 'Error sharing post' });
    }
});

module.exports = router;

