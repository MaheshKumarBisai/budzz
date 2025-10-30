require('dotenv').config();
const app = require('./app');
const { initializeDatabase } = require('./src/config/database');
const { startCronJobs } = require('./src/services/cronService');

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Smart Budget & Expense Tracker API...');

    // Initialize database schema
    await initializeDatabase();

    // Start cron jobs
    startCronJobs();

    // Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('=' .repeat(60));
      console.log('Server running on port ' + PORT);
      console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
      console.log('Database: Connected');
      console.log('Cron jobs: Active');
      console.log('API Ready!');
      console.log('=' .repeat(60));
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
