const { query } = require('../config/database');

const processRecurringTransactions = async () => {
  console.log('🔄 Processing recurring transactions...');
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await query(
      'SELECT * FROM recurring_transactions WHERE is_active = true AND next_run_date <= $1',
      [today]
    );

    let processed = 0;
    for (const recurring of result.rows) {
      // Create transaction
      await query(
        `INSERT INTO transactions (user_id, category_id, type, amount, description, payment_mode, transaction_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [recurring.user_id, recurring.category_id, recurring.type, recurring.amount,
         recurring.description || `Recurring ${recurring.type}`, recurring.payment_mode, recurring.next_run_date]
      );

      // Calculate next run date
      let nextDate = new Date(recurring.next_run_date);
      switch (recurring.frequency) {
        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
        case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
      }

      const nextDateStr = nextDate.toISOString().split('T')[0];
      const isActive = recurring.end_date ? nextDate <= new Date(recurring.end_date) : true;

      await query(
        'UPDATE recurring_transactions SET next_run_date = $1, is_active = $2 WHERE id = $3',
        [nextDateStr, isActive, recurring.id]
      );

      processed++;
    }

    console.log(`✅ Processed ${processed} recurring transactions`);
    return { processed };
  } catch (error) {
    console.error('❌ Recurring transactions error:', error);
    throw error;
  }
};

module.exports = { processRecurringTransactions };
