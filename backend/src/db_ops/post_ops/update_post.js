const { pool } = require('../../config/db');

/* 
* - UPDATES A POST'S CONTENT AND TIMESTAMP
* - ONLY THE OWNER OF THE POST CAN UPDATE IT
* - RETURNS THE UPDATED POST DATA
*/
async function updatePost(postId, userId, newContent) {
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
            'UPDATE Posts SET Content = ?, CreatedAt = CURRENT_TIMESTAMP WHERE PostID = ?',
            [newContent, postId]
        );

        if (result.affectedRows > 0) {
            // Fetch and return the updated post data
            const [updatedPost] = await pool.query(
                'SELECT PostID, UserID, Content, CreatedAt FROM Posts WHERE PostID = ?',
                [postId]
            );
            return updatedPost[0];
        }
        return false;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}

module.exports = { updatePost };