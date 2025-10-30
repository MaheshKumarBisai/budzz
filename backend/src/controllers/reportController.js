const { query } = require('../config/database');

const getMonthlyReport = async (req, res, next) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;

    const result = await query(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        COUNT(*) as transaction_count
      FROM transactions
      WHERE user_id = $1 AND deleted_at IS NULL
        AND EXTRACT(MONTH FROM transaction_date) = $2
        AND EXTRACT(YEAR FROM transaction_date) = $3
    `, [req.user.id, month, year]);

    const categoryResult = await query(`
      SELECT c.name, c.icon, SUM(t.amount) as amount, COUNT(t.id) as count
      FROM transactions t
      JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1 AND t.deleted_at IS NULL AND t.type = 'expense'
        AND EXTRACT(MONTH FROM t.transaction_date) = $2
        AND EXTRACT(YEAR FROM t.transaction_date) = $3
      GROUP BY c.id, c.name, c.icon
      ORDER BY amount DESC
    `, [req.user.id, month, year]);

    const summary = result.rows[0];
    res.json({ 
      success: true, 
      data: { 
        summary: {
          ...summary,
          net_savings: (parseFloat(summary.total_income || 0) - parseFloat(summary.total_expenses || 0)).toFixed(2)
        },
        by_category: categoryResult.rows 
      } 
    });
  } catch (error) {
    next(error);
  }
};

const getComparison = async (req, res, next) => {
  try {
    // Simplified comparison
    res.json({ success: true, data: { message: 'Comparison endpoint' } });
  } catch (error) {
    next(error);
  }
};

const exportReport = async (req, res, next) => {
  try {
    const { format = 'csv' } = req.query;
    res.json({ success: true, data: { format, message: 'Export endpoint - implement with fast-csv or pdfkit' } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMonthlyReport, getComparison, exportReport };
