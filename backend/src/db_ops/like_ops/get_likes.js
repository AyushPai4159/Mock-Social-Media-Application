const { pool } = require('../../config/db');

/* 
* - CHECKS IF A USER HAS ALREADY LIKED A POST
* - RETURNS TRUE IF THEY HAVE, FALSE IF NOT
*/
async function hasUserLiked(postId, userId) {
    try {
        const [likes] = await pool.query(
            'SELECT LikeID FROM Likes WHERE PostID = ? AND UserID = ?',
            [postId, userId]
        );
        return likes.length > 0;
    } catch (error) {
        console.error('Error checking like status:', error);
        throw error;
    }
}

/* 
* - GETS THE TOTAL NUMBER OF LIKES FOR A POST
*/
async function getLikeCount(postId) {
    try {
        const [metrics] = await pool.query(
            'SELECT LikeCount FROM PostMetrics WHERE PostID = ?',
            [postId]
        );
        return metrics[0]?.LikeCount || 0;
    } catch (error) {
        console.error('Error getting like count:', error);
        throw error;
    }
}

module.exports = { hasUserLiked, getLikeCount };