const { query } = require('../config/database');

const checkBudgetAlerts = async () => {
  console.log('🚨 Checking budget alerts...');
  try {
    const users = await query('SELECT user_id, budget_limit FROM user_settings WHERE budget_limit > 0');
    let alertsCreated = 0;

    for (const user of users.rows) {
      const expenses = await query(`
        SELECT SUM(amount) as total
        FROM transactions
        WHERE user_id = $1 AND type = 'expense' AND deleted_at IS NULL
          AND EXTRACT(MONTH FROM transaction_date) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM transaction_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      `, [user.user_id]);

      const total = parseFloat(expenses.rows[0].total || 0);
      const limit = parseFloat(user.budget_limit);
      const percentage = (total / limit) * 100;

      if (percentage >= 80 && percentage < 100) {
        await query(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES ($1, 'budget_warning', 'Budget Warning', 'You have used ${percentage.toFixed(1)}% of your budget')`,
          [user.user_id]
        );
        alertsCreated++;
      } else if (percentage >= 100) {
        await query(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES ($1, 'budget_exceeded', 'Budget Exceeded', 'You have exceeded your budget by ${(percentage - 100).toFixed(1)}%')`,
          [user.user_id]
        );
        alertsCreated++;
      }
    }

    console.log(`✅ Created ${alertsCreated} budget alerts`);
    return { alerts: alertsCreated };
  } catch (error) {
    console.error('❌ Budget alerts error:', error);
    throw error;
  }
};

module.exports = { checkBudgetAlerts };
