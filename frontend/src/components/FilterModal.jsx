import React, { useState } from 'react';

const CATEGORIES = {
  expense: [
    { id: 4, name: 'Food' },
    { id: 5, name: 'Transport' },
    { id: 6, name: 'Shopping' },
    { id: 7, name: 'Bills' },
    { id: 8, name: 'Health' },
    { id: 9, name: 'Entertainment' },
    { id: 10, name: 'Other' },
  ],
  income: [
    { id: 1, name: 'Salary' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Investment' },
  ],
};

const PAYMENT_MODES = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI'];

const FilterModal = ({ isOpen, onClose, onApply, type }) => {
  const [paymentMode, setPaymentMode] = useState('');
  const [categoryId, setCategoryId] = useState('');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      payment_mode: paymentMode,
      category_id: categoryId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-dark-gray p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Filter Transactions</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="input border border-gray-600"
            >
              <option value="">All</option>
              {CATEGORIES[type].map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="input border border-gray-600"
            >
              <option value="">All</option>
              {PAYMENT_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleApply} className="btn-primary">Apply</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
