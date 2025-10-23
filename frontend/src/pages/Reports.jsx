import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { reportAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Reports() {
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    try {
      const response = await reportAPI.getMonthlyReport(selectedMonth, selectedYear);
      setMonthlyData(response.data.data);
    } catch (error) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await reportAPI.exportReport(format);
      toast.success(`Report exported as ${format.toUpperCase()}`);
      // In production, handle file download
    } catch (error) {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const categoryData = monthlyData?.by_category?.map(cat => ({
    name: cat.name,
    amount: parseFloat(cat.amount),
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('csv')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="card">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="input"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="input"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
          <p className="text-2xl font-bold text-green-600">
            ${parseFloat(monthlyData?.summary?.total_income || 0).toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">
            ${parseFloat(monthlyData?.summary?.total_expenses || 0).toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Net Savings</p>
          <p className="text-2xl font-bold text-primary-600">
            ${parseFloat(monthlyData?.summary?.net_savings || 0).toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
          <p className="text-2xl font-bold">
            {monthlyData?.summary?.transaction_count || 0}
          </p>
        </div>
      </div>

      {/* Category Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available</p>
        )}
      </div>

      {/* Category Details */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
        <div className="space-y-2">
          {categoryData.map((cat, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="font-medium">{cat.name}</span>
              <span className="font-semibold">${cat.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
