const { pool } = require('../../config/db');


async function getUserById(userId) {
    try {
        const [user] = await pool.query(
            'SELECT UserID, Username, Email, CreatedAt FROM Users WHERE UserID = ?', 
            [userId]
        );
        return user[0];
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
}


async function getUserByUsername(username) {
    try {
        const [users] = await pool.query(
            'SELECT UserID, Username FROM Users WHERE Username = ?',
            [username]
        );
        return users[0] || null;
    } catch (error) {
        console.error('Error getting user by username:', error);
        throw error;
    }
}

async function getUserForAuth(username, password) {
    try {
        const [user] = await pool.query(
            'SELECT UserID FROM Users WHERE Username = ? AND Password = ?',
            [username, password]
        );
        return user[0]?.UserID || null;
    } catch (error) {
        console.error('Error during authentication:', error);
        throw error;
    }
}

module.exports = {
    getUserById,
    getUserByUsername,
    getUserForAuth
};