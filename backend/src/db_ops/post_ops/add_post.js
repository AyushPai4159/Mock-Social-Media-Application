const { pool } = require('../../config/db');

/* 
* - ADDS A POST TO THE DATABASE
* - CREATES CORRESPONDING METRICS
* - USES TRANSACTION TO ENSURE BOTH OPERATIONS SUCCEED
* - HANDLES CONTENT FILTER TRIGGER ERRORS
*/
async function addPost(userId, content) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Create post
        const [result] = await connection.query(
            'INSERT INTO Posts (UserID, Content) VALUES (?, ?)',
            [userId, content]
        );
        
        // Create metrics
        await connection.query(
            'INSERT INTO PostMetrics (PostID, LikeCount, ShareCount) VALUES (?, 0, 0)',
            [result.insertId]
        );
        
        await connection.commit();
        return result.insertId;
    } catch (error) {
        await connection.rollback();
        // Check if it's our trigger error (inappropriate content)
        if (error.sqlState === '45000') {
            throw { 
                status: 400, 
                message: error.sqlMessage || 'Post contains inappropriate content'
            };
        }
        console.error('Error adding post:', error);
        throw { status: 500, message: 'Failed to create post' };
    } finally {
        connection.release();
    }
}

module.exports = { addPost };