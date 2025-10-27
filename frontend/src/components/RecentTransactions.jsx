import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { formatCurrency } from '../utils/currency';

const RecentTransactions = ({ transactions }) => {
  const { settings } = useSettings();

  return (
    <div className="bg-card dark:bg-dark-card p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Recent Transactions</h2>
        <Link to="/transactions" className="text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {transactions.map((txn) => (
          <div key={txn.id} className="flex justify-between items-center p-3 rounded-lg bg-background dark:bg-dark-background">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${txn.transaction_type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}>
                {txn.transaction_type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
              </div>
              <div>
                <p className="font-bold text-text-primary dark:text-dark-text-primary">{txn.category?.name || 'Uncategorized'}</p>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{new Date(txn.transaction_date).toLocaleDateString()}</p>
              </div>
            </div>
            <p className={`font-bold ${txn.transaction_type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
              {txn.transaction_type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, settings.currency)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
