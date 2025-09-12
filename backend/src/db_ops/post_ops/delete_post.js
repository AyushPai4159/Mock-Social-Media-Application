const { pool } = require('../../config/db');

/* 
* - DELETES A POST FROM THE DATABASE
* - ALSO DELETES ALL ASSOCIATED METRICS, LIKES, AND SHARES (CASCADE)
* - ONLY THE OWNER OF THE POST CAN DELETE IT
* - RETURNS TRUE IF POST WAS DELETED, FALSE IF POST DOESN'T EXIST OR USER ISN'T OWNER
*/
async function deletePost(postId, userId) {
    try {
        // First check if user owns the post
        const [post] = await pool.query(
            'SELECT PostID FROM Posts WHERE PostID = ? AND UserID = ?',
            [postId, userId]
        );

        if (post.length === 0) {
            return false;
        }

        const [result] = await pool.query(
            'DELETE FROM Posts WHERE PostID = ?',
            [postId]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

module.exports = { deletePost };