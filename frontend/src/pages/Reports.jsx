import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { reportAPI } from '../services/api';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSettings } from '../contexts/SettingsContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
};

export default function Reports() {
  const { settings } = useSettings();
  const symbol = currencySymbols[settings.currency] || '$';

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
    if (!monthlyData) {
      toast.error('No data to export');
      return;
    }

    const summary = [
      ['Total Income', monthlyData.summary.total_income],
      ['Total Expenses', monthlyData.summary.total_expenses],
      ['Net Savings', monthlyData.summary.net_savings],
      ['Transactions', monthlyData.summary.transaction_count],
    ];

    const categories = monthlyData.by_category.map(c => [c.name, c.amount]);

    if (format === 'csv') {
      const csv = Papa.unparse({
        fields: ['Metric', 'Value'],
        data: summary,
      });
      const csv2 = Papa.unparse({
        fields: ['Category', 'Amount'],
        data: categories,
      });
      const blob = new Blob([csv + '\n\n' + csv2], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Monthly Report', 20, 10);
      doc.autoTable({
        head: [['Metric', 'Value']],
        body: summary,
      });
      doc.autoTable({
        head: [['Category', 'Amount']],
        body: categories,
      });
      doc.save('report.pdf');
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
      {monthlyData && monthlyData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              {symbol}{parseFloat(monthlyData.summary.total_income || 0).toFixed(2)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              {symbol}{parseFloat(monthlyData.summary.total_expenses || 0).toFixed(2)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Net Savings</p>
            <p className="text-2xl font-bold text-primary-600">
              {symbol}{parseFloat(monthlyData.summary.net_savings || 0).toFixed(2)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
            <p className="text-2xl font-bold">
              {monthlyData.summary.transaction_count || 0}
            </p>
          </div>
        </div>
      )}

      {/* Category Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {
                  categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-8">No data available</p>
        )}
      </div>

      {/* Category Details */}
      <div className="bg-dark-gray rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Category Breakdown</h2>
        <div className="space-y-4">
          {categoryData.map((cat, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-light-dark-gray">
              <div className="flex items-center space-x-3">
                <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[idx % COLORS.length], borderRadius: '50%' }}></div>
                <span className="font-medium text-white">{cat.name}</span>
              </div>
              <span className="font-semibold text-white">{symbol}{cat.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
