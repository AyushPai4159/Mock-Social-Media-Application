const { pool } = require('../../config/db');


async function updateUser(userId, updates = {}) {
    try {
        const updateFields = [];
        const values = [];
        
        if (updates.username) {
            updateFields.push('Username = ?');
            values.push(updates.username);
        }
        if (updates.email) {
            updateFields.push('Email = ?');
            values.push(updates.email);
        }
        if (updates.password) {
            updateFields.push('Password = ?');
            values.push(updates.password);
        }

        if (updateFields.length === 0) {
            return false; 
        }

        values.push(userId); 

        const [result] = await pool.query(
            `UPDATE Users SET ${updateFields.join(', ')} WHERE UserID = ?`,
            values
        );

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

module.exports = { updateUser };