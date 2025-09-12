const express = require('express');
const router = express.Router();
const { addShare } = require('../db_ops/share_ops/add_share');
const { removeShare } = require('../db_ops/share_ops/remove_share');
const { getPostsSharedWithUser, getSharesByPost } = require('../db_ops/share_ops/get_shares');
const auth = require('../middleware/auth');

router.delete('/shares/:shareId', auth, async (req, res) => {
    try {
        const success = await removeShare(req.params.shareId, req.session.userId);
        
        if (success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Share not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error removing share' });
    }
});



module.exports = router;