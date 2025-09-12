const app = require('./app');
const setupDatabase = require('./database/firstTimeSetup');

const PORT = process.env.PORT || 3000;

// Setup database and start server
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
});