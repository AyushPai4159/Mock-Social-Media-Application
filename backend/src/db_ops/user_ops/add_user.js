const { pool}  = require('../../config/db');


/* 
* -ADDS A USER TO THE DATABASE
*/
async function addUser(username, email, password) {

    try {
        const doesUserExist = await checkIfUserExists(username, email);
        if(doesUserExist) {
            throw new Error('User already exists');
        }

        await pool.query(
            `INSERT INTO Users (Username, Email, Password) VALUES (?, ?, ?)`,
            [username, email, password]
        );
        console.log('User added successfully');
    } catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
    }
}

/*
* HELPER FUNCTIONS HERE ON DOWN
*/

async function checkIfUserExists(username, email) {
    const [user] = await pool.query(`SELECT * FROM Users WHERE Username = ? OR Email = ?`, [username, email]);
    return user.length > 0;
}


module.exports = { addUser };





     