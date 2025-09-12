const mysql = require('mysql2/promise');
const path = require('path');

const { CREATE_DATABASE, CREATE_TABLES, CREATE_PROCEDURES, CREATE_TRIGGERS, INITIAL_DATA } = require('./queries');
const  MOCK_DATA  = require('./mockData');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function insertMockData(connection){
    try{
        // Insert initial data first (banned words)
        console.log('Inserting initial data...');
        for (const [table, query] of Object.entries(INITIAL_DATA)) {
            console.log(`Inserting initial ${table}...`);
            await connection.query(query);
            console.log(`Initial ${table} inserted successfully`);
        }

        // Then insert mock data
        for (const [table, query] of Object.entries(MOCK_DATA)) {
            console.log(`Inserting mock ${table}...`);
            await connection.query(query);
            console.log(`Mock ${table} inserted successfully`);
        }
    }catch(error){
        console.error('Error inserting data:', error);
        throw error;  
    }
}

async function setupDatabase() {
    let connection;
    try {
        // First connection to create database
        console.log('Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        // Check if database already exists
        console.log('Checking if database exists...');
        const [databases] = await connection.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME]);
        if (databases.length > 0) {
            console.log(`Database ${process.env.DB_NAME} already exists. Exiting setup.`);
            return;
        }

        // Create database
        console.log('Creating database...');
        await connection.query(CREATE_DATABASE);

        // Use the database
        console.log('Switching to database...');
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Create tables in order
        console.log('Creating tables...');
        for (const [tableName, query] of Object.entries(CREATE_TABLES)) {
            console.log(`Creating ${tableName} table...`);
            await connection.query(query);
            console.log(`${tableName} table created successfully`);
        }

        // Create triggers
        console.log('Creating triggers...');
        for (const [triggerName, query] of Object.entries(CREATE_TRIGGERS)) {
            console.log(`Creating ${triggerName} trigger...`);
            // Drop existing trigger if it exists
            await connection.query(`DROP TRIGGER IF EXISTS ${triggerName}`);
            // Create new trigger
            await connection.query(query);
            console.log(`${triggerName} trigger created successfully`);
        }

        // Create stored procedures
        console.log('Creating stored procedures...');
        for (const [procName, query] of Object.entries(CREATE_PROCEDURES)) {
            console.log(`Creating ${procName} procedure...`);
            // Drop existing procedure if it exists
            await connection.query(`DROP PROCEDURE IF EXISTS ${procName}`);
            // Create new procedure
            await connection.query(query);
            console.log(`${procName} procedure created successfully`);
        }

        // Insert mock data and initial data
        console.log('Inserting data...');
        await insertMockData(connection);

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error during database setup:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

if (require.main === module) {
    setupDatabase();
}

module.exports = setupDatabase;