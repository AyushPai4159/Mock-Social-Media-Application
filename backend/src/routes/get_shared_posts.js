const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');  // Our auth middleware
const { getPostsSharedWithUser } = require('../db_ops/share_ops/get_shares');


router.get('/shared-with-me', auth, async (req, res) => {
    console.log('Getting shared posts for user:', req.session.userId);
    try {
        const sharedPosts = await getPostsSharedWithUser(req.session.userId);
        console.log('Found shared posts:', sharedPosts);
        res.json(sharedPosts);
    } catch (error) {
        console.error('Get shared posts error:', error);
        res.status(500).json({ error: 'Error getting shared posts' });
    }
});
module.exports = router;

