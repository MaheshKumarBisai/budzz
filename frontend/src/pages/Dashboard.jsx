import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { reportAPI, expenseAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('$');

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

      const userRes = await userAPI.getProfile();
      setCurrency(userRes.data.data.user.settings.currency);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const COLORS = ['#32cd32', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <Link to="/transactions/add" className="px-6 py-3 bg-primary text-background-card rounded-md hover:bg-green-400 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Transaction</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Income</p>
              <p className="text-2xl font-bold text-green-500">
                {currency}{parseFloat(summary?.total_income || 0).toFixed(2)}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Expenses</p>
              <p className="text-2xl font-bold text-red-500">
                {currency}{parseFloat(summary?.total_expenses || 0).toFixed(2)}
              </p>
            </div>
            <TrendingDown className="text-red-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Net Savings</p>
              <p className="text-2xl font-bold text-primary">
                {currency}{parseFloat(summary?.net_savings || 0).toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-primary" size={32} />
          </div>
        </div>
      </div>

      {/* Budget Alert */}
      {summary?.budget_used_percentage >= 80 && (
        <div className="card bg-yellow-900/50 border-yellow-500/50">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-yellow-400" size={24} />
            <div>
              <p className="font-medium text-yellow-300">
                Budget Warning
              </p>
              <p className="text-sm text-yellow-400">
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
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Expenses by Category</h2>
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
            <p className="text-center text-text-secondary py-8">No expense data</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((txn) => (
                <div key={txn.id} className="flex justify-between items-center p-3 bg-background-card rounded">
                  <div>
                    <p className="font-medium text-text-primary">{txn.category_name}</p>
                    <p className="text-xs text-text-secondary">{new Date(txn.transaction_date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-semibold text-red-500">
                    -{currency}{parseFloat(txn.amount).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-text-secondary py-8">No transactions yet</p>
            )}
          </div>
          <Link to="/transactions" className="block text-center text-primary hover:underline mt-4">
            View all transactions
          </Link>
        </div>
      </div>
    </div>
  );
}
