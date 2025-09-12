const { pool}  = require('../../config/db');


/* 
* - DELETES A USER FROM THE DATABASE
* - ALSO DELETES ALL POSTS AND LIKES ASSOCIATED WITH THE USER
*/
async function deleteUser(userID) {
    try {
        const [user] = await pool.query(
            'SELECT UserID FROM Users WHERE UserID = ?',
            [userID]
        );

        if (user.length === 0) {
            return false; 
        }

        const [result] = await pool.query(
            'DELETE FROM Users WHERE UserID = ?',
            [userID]
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

module.exports = { deleteUser };










     