const { pool } = require('../../config/db');


async function removeLike(postId, userId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const [result] = await connection.query(
            'DELETE FROM Likes WHERE PostID = ? AND UserID = ?',
            [postId, userId]
        );
        
        if (result.affectedRows > 0) {
            // Only decrement if we actually removed a like
            await connection.query(
                'UPDATE PostMetrics SET LikeCount = LikeCount - 1 WHERE PostID = ?',
                [postId]
            );
            await connection.commit();
            return true;
        }
        
        await connection.rollback();
        return false;
    } catch (error) {
        await connection.rollback();
        console.error('Error removing like:', error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { removeLike };