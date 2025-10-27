import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
};

const RecentTransactions = ({ transactions }) => {
  const { currency } = useCurrency();
  const symbol = currencySymbols[currency] || '$';

  return (
    <div className="bg-dark-gray rounded-lg p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>
        <Link to="/transactions" className="text-lime-500 hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {transactions.slice(0, 5).map((txn) => (
          <div key={txn.id} className="flex justify-between items-center p-3 rounded-lg bg-light-dark-gray">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${txn.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                {txn.amount > 0 ? <FaArrowUp /> : <FaArrowDown />}
              </div>
              <div>
                <p className="font-bold">{txn.category?.name || 'Uncategorized'}</p>
                <p className="text-sm text-light-gray">{new Date(txn.transaction_date).toLocaleDateString()}</p>
              </div>
            </div>
            <p className={`font-bold ${txn.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {txn.amount > 0 ? '+' : '-'}{symbol}{Math.abs(txn.amount).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
