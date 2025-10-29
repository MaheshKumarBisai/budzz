import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { reportAPI } from '../services/api';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSettings } from '../contexts/SettingsContext';
import Button from '../components/Button';
import { formatCurrency } from '../utils/currency';

const COLORS = ['#355070', '#6d597a', '#b56576', '#e56b6f', '#eaac8b'];

export default function Reports() {
  const { settings } = useSettings();

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
      ['Total Income', formatCurrency(monthlyData.summary.total_income, settings.currency)],
      ['Total Expenses', formatCurrency(monthlyData.summary.total_expenses, settings.currency)],
      ['Net Savings', formatCurrency(monthlyData.summary.net_savings, settings.currency)],
      ['Transactions', monthlyData.summary.transaction_count],
    ];

    const categories = monthlyData.by_category.map(c => [c.name, formatCurrency(c.amount, settings.currency)]);

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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
        <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => handleExport('csv')}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <Download size={20} />
            <span>CSV</span>
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <Download size={20} />
            <span>PDF</span>
          </Button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-card dark:bg-dark-card p-4 rounded-2xl shadow-lg">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>{month}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
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
          <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-lg">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Total Income</p>
            <p className="text-2xl font-bold text-green-500">
              {formatCurrency(monthlyData.summary.total_income || 0, settings.currency)}
            </p>
          </div>
          <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-lg">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Total Expenses</p>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(monthlyData.summary.total_expenses || 0, settings.currency)}
            </p>
          </div>
          <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-lg">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Net Savings</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(monthlyData.summary.net_savings || 0, settings.currency)}
            </p>
          </div>
          <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-lg">
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Transactions</p>
            <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {monthlyData.summary.transaction_count || 0}
            </p>
          </div>
        </div>
      )}

      {/* Category Chart */}
      <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-dark-text-primary">Spending by Category</h2>
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
          <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">No data available</p>
        )}
      </div>

      {/* Category Details */}
      <div className="bg-card dark:bg-dark-card p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-text-primary dark:text-dark-text-primary">Category Breakdown</h2>
        <div className="space-y-4">
          {categoryData.map((cat, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-background dark:bg-dark-background">
              <div className="flex items-center space-x-3">
                <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[idx % COLORS.length], borderRadius: '50%' }}></div>
                <span className="font-medium text-text-primary dark:text-dark-text-primary">{cat.name}</span>
              </div>
              <span className="font-semibold text-text-primary dark:text-dark-text-primary">{formatCurrency(cat.amount, settings.currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
