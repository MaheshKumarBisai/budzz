import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { reportAPI, expenseAPI, incomeAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const reportRes = await reportAPI.getMonthlyReport(month, year);
      setSummary(reportRes.data.data.summary);
      setCategories(reportRes.data.data.by_category || []);

      const expensesRes = await expenseAPI.getExpenses({ limit: 5 });
      setRecentTransactions(expensesRes.data.data.expenses || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/transactions/add" className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Transaction</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${parseFloat(summary?.total_income || 0).toFixed(2)}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ${parseFloat(summary?.total_expenses || 0).toFixed(2)}
              </p>
            </div>
            <TrendingDown className="text-red-600" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Savings</p>
              <p className="text-2xl font-bold text-primary-600">
                ${parseFloat(summary?.net_savings || 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-primary-600" size={32} />
          </div>
        </div>
      </div>

      {/* Budget Alert */}
      {summary?.budget_used_percentage >= 80 && (
        <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-yellow-600" size={24} />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-300">
                Budget Warning
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                You've used {summary.budget_used_percentage.toFixed(1)}% of your monthly budget
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
          {categories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categories.map(cat => ({ name: cat.name, value: parseFloat(cat.amount) }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">No expense data</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((txn) => (
                <div key={txn.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <p className="font-medium">{txn.category_name}</p>
                    <p className="text-xs text-gray-500">{new Date(txn.transaction_date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-semibold text-red-600">
                    -${parseFloat(txn.amount).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            )}
          </div>
          <Link to="/transactions" className="block text-center text-primary-600 hover:underline mt-4">
            View all transactions
          </Link>
        </div>
      </div>
    </div>
  );
}
