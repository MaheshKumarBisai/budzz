import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { formatCurrency } from '../utils/currency';

const DashboardSummary = ({ summary }) => {
  const { settings } = useSettings();
  const { total_income, total_expenses, remaining_budget } = summary;

  const summaryCards = [
    { title: 'Total Income', value: formatCurrency(total_income, settings.currency), color: 'text-green-500' },
    { title: 'Total Expenses', value: formatCurrency(total_expenses, settings.currency), color: 'text-red-500' },
    { title: 'Remaining Budget', value: formatCurrency(remaining_budget, settings.currency), color: 'text-blue-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {summaryCards.map((card, index) => (
        <div key={index} className="bg-card dark:bg-dark-card p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-secondary dark:text-dark-text-secondary">{card.title}</h3>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
