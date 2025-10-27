import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { expenseAPI, incomeAPI, settingsAPI } from '../services/api';
import RecentTransactions from '../components/RecentTransactions';
import RemainingBudget from '../components/RemainingBudget';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = React.useState([]);
  const [budget, setBudget] = React.useState({
    total_income: 0,
    total_expenses: 0,
    budget_limit: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenses, incomes, settings] = await Promise.all([
          expenseAPI.getExpenses(),
          incomeAPI.getIncomes(),
          settingsAPI.getSettings(),
        ]);

        const allTransactions = [...expenses.data.data.expenses, ...incomes.data.data.incomes];
        allTransactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
        setTransactions(allTransactions);

        const totalIncome = incomes.data.data.incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = expenses.data.data.expenses.reduce((acc, curr) => acc + curr.amount, 0);

        setBudget({
          total_income: totalIncome,
          total_expenses: totalExpenses,
          budget_limit: settings.data.data.settings.budget_limit,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-8 text-white">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome, {user ? user.name : 'Guest'}!
        </h1>
        <p className="text-lg text-light-gray mt-1">
          Here’s a snapshot of your financial health.
        </p>
      </header>

      {transactions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentTransactions transactions={transactions} />
          </div>
          <div>
            <RemainingBudget budget={budget} />
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-light-gray">
            No transactions yet. Add one to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
