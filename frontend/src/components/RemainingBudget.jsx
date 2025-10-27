import React from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { useCurrency } from '../contexts/CurrencyContext';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
};

const RemainingBudget = ({ budget }) => {
  const { currency } = useCurrency();
  const symbol = currencySymbols[currency] || '$';

  const { total_income, total_expenses, budget_limit } = budget;
  const remaining = total_income - total_expenses;
  const limit = budget_limit || total_income;
  const percentage = limit > 0 ? (remaining / limit) * 100 : 0;

  return (
    <div className="bg-dark-gray rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4">Remaining Budget</h2>
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-green-500 rounded-full">
          <FaDollarSign size={24} />
        </div>
        <div>
          <p className="text-3xl font-bold">{symbol}{remaining.toFixed(2)}</p>
          <p className="text-sm text-light-gray">out of {symbol}{limit.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-light-dark-gray rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RemainingBudget;
