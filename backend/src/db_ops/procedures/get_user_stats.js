const { pool } = require('../../config/db');

async function getUserStats(userId) {
    try {
        console.log('Getting stats for user ID:', userId);
        const [result] = await pool.query(
            'CALL CalculateUserStats(?)',
            [userId]
        );
        console.log('Raw result from procedure:', JSON.stringify(result, null, 2));
        console.log('First result set:', JSON.stringify(result[0], null, 2));
        console.log('First row:', JSON.stringify(result[0][0], null, 2));
        
        return result[0][0] || { TotalPosts: 0, TotalLikesReceived: 0, TotalSharesReceived: 0 };
    } catch (error) {
        console.error('Error getting user stats:', error);
        throw error;
    }
}

module.exports = { getUserStats };