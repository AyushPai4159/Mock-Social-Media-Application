const { pool } = require('../../config/db');

/* 
* - REMOVES A SHARE
* - DECREMENTS THE SHARECOUNT IN POSTMETRICS
* - USES TRANSACTION TO ENSURE BOTH OPERATIONS SUCCEED
* - ONLY THE SHARER (FromUserID) CAN REMOVE THEIR SHARE
* - RETURNS FALSE IF SHARE DIDN'T EXIST
*/
async function removeShare(shareId, fromUserId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Remove the share (only if it belongs to fromUserId)
        const [result] = await connection.query(
            'DELETE FROM Shares WHERE ShareID = ? AND FromUserID = ?',
            [shareId, fromUserId]
        );
        
        if (result.affectedRows > 0) {
            // Only decrement if we actually removed a share
            await connection.query(
                'UPDATE PostMetrics SET ShareCount = ShareCount - 1 WHERE PostID = (SELECT PostID FROM Shares WHERE ShareID = ?)',
                [shareId]
            );
            await connection.commit();
            return true;
        }
        
        await connection.rollback();
        return false;
    } catch (error) {
        await connection.rollback();
        console.error('Error removing share:', error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { removeShare };