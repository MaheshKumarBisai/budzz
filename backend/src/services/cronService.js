const cron = require('node-cron');
const { processRecurringTransactions } = require('../jobs/recurringTransactions');
const { checkBudgetAlerts } = require('../jobs/budgetAlerts');

const startCronJobs = () => {
  console.log('⏰ Starting cron jobs...');

  // Recurring transactions - every hour
  cron.schedule('0 * * * *', async () => {
    console.log('🔄 Running recurring transactions job');
    try {
      await processRecurringTransactions();
    } catch (error) {
      console.error('❌ Recurring transactions job error:', error);
    }
  });

  // Budget alerts - daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('🚨 Running budget alerts job');
    try {
      await checkBudgetAlerts();
    } catch (error) {
      console.error('❌ Budget alerts job error:', error);
    }
  });

  console.log('✅ Cron jobs started');
};

module.exports = { startCronJobs };
