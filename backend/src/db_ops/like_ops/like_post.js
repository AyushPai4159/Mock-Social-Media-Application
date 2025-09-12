const { pool } = require('../../config/db');


async function addLike(postId, userId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const [result] = await connection.query(
            'INSERT INTO Likes (PostID, UserID) VALUES (?, ?)',
            [postId, userId]
        );
        
        await connection.query(
            'UPDATE PostMetrics SET LikeCount = LikeCount + 1 WHERE PostID = ?',
            [postId]
        );
        
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return false; // User already liked this post
        }
        console.error('Error adding like:', error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { addLike };