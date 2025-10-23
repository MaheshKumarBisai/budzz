// Helper utility functions

const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

const calculatePercentage = (part, whole) => {
  return whole > 0 ? ((part / whole) * 100).toFixed(2) : 0;
};

module.exports = { formatCurrency, formatDate, calculatePercentage };
