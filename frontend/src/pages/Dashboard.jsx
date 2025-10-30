import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { expenseAPI, incomeAPI, settingsAPI } from '../services/api';
import RecentTransactions from '../components/RecentTransactions';
import DashboardSummary from '../components/DashboardSummary';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState([]);
  const [summary, setSummary] = React.useState({
    total_income: 0,
    total_expenses: 0,
    remaining_budget: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenses, incomes, settings] = await Promise.all([
          expenseAPI.getExpenses(),
          incomeAPI.getIncomes(),
          settingsAPI.getSettings(),
        ]);

        const expensesList = expenses.data.data.expenses.map(txn => ({ ...txn, type: 'expense' }));
        const incomesList = incomes.data.data.incomes.map(txn => ({ ...txn, type: 'income' }));
        const allTransactions = [...expensesList, ...incomesList];
        allTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
        setTransactions(allTransactions);

        const totalIncome = incomes.data.data.incomes.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
        const totalExpenses = expenses.data.data.expenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
        const remainingBudget = totalIncome - totalExpenses;

        setSummary({
          total_income: totalIncome,
          total_expenses: totalExpenses,
          remaining_budget: remainingBudget,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-dark-text-primary">
          Welcome, {user ? user.name : 'Guest'}!
        </h1>
        <p className="text-lg text-text-secondary dark:text-dark-text-secondary mt-1">
          Here’s a snapshot of your financial health.
        </p>
      </header>

      <DashboardSummary summary={summary} />

      {transactions.length > 0 ? (
        <RecentTransactions transactions={transactions.slice(0, 5)} />
      ) : (
        <div className="text-center py-16 bg-card dark:bg-dark-card rounded-lg">
          <p className="text-xl text-text-secondary dark:text-dark-text-secondary">
            No transactions yet. Add one to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
