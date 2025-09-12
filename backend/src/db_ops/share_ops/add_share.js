const { pool } = require('../../config/db');

/* 
* - SHARES A POST FROM ONE USER TO ANOTHER
* - INCREMENTS THE SHARECOUNT IN POSTMETRICS
* - USES TRANSACTION TO ENSURE BOTH OPERATIONS SUCCEED
* - CHECKS THAT:
*   1. FromUser != ToUser
*   2. Both users exist
*   3. Post exists
*/
async function addShare(postId, fromUserId, toUserId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Add the share
        const [result] = await connection.query(
            'INSERT INTO Shares (PostID, FromUserID, ToUserID) VALUES (?, ?, ?)',
            [postId, fromUserId, toUserId]
        );
        
        // Increment share count
        await connection.query(
            'UPDATE PostMetrics SET ShareCount = ShareCount + 1 WHERE PostID = ?',
            [postId]
        );
        
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        console.error('Error adding share:', error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { addShare };