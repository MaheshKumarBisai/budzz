import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { expenseAPI, incomeAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = {
  expense: [
    { id: 4, name: 'Food', icon: '🍔' },
    { id: 5, name: 'Transport', icon: '🚗' },
    { id: 6, name: 'Shopping', icon: '🛍️' },
    { id: 7, name: 'Bills', icon: '📄' },
    { id: 8, name: 'Health', icon: '🏥' },
    { id: 9, name: 'Entertainment', icon: '🎬' },
    { id: 10, name: 'Other', icon: '📦' },
  ],
  income: [
    { id: 1, name: 'Salary', icon: '💰' },
    { id: 2, name: 'Business', icon: '💼' },
    { id: 3, name: 'Investment', icon: '📈' },
  ],
};

export default function AddTransaction() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [type, setType] = useState('expense');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && location.state?.transaction) {
      const txn = location.state.transaction;
      setType(location.state.type);
      setCategoryId(txn.category_id);
      setAmount(txn.amount);
      setDescription(txn.description || '');
      setPaymentMode(txn.payment_mode || 'Cash');
      setDate(txn.transaction_date);
    }
  }, [id, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      category_id: parseInt(categoryId),
      amount: parseFloat(amount),
      description,
      payment_mode: paymentMode,
      transaction_date: date,
    };

    try {
      const api = type === 'expense' ? expenseAPI : incomeAPI;

      if (id) {
        await api[type === 'expense' ? 'updateExpense' : 'updateIncome'](id, data);
        toast.success('Transaction updated');
      } else {
        await api[type === 'expense' ? 'createExpense' : 'createIncome'](data);
        toast.success('Transaction added');
      }

      navigate('/transactions');
    } catch (error) {
      toast.error('Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{id ? 'Edit' : 'Add'} Transaction</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Type Selection */}
        {!id && (
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => { setType('expense'); setCategoryId(''); }}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  type === 'expense'
                    ? 'bg-lime-500 text-white'
                    : 'bg-transparent border border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => { setType('income'); setCategoryId(''); }}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  type === 'income'
                    ? 'bg-lime-500 text-white'
                    : 'bg-transparent border border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white'
                }`}
              >
                Income
              </button>
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="input border border-gray-600 rounded-md"
            required
          >
            <option value="">Select category</option>
            {CATEGORIES[type].map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input border border-gray-600 rounded-md"
            placeholder="0.00"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input border border-gray-600 rounded-md"
            rows="3"
            placeholder="Add notes..."
          />
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm font-medium mb-2">Payment Mode</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="input border border-gray-600 rounded-md"
          >
            <option>Cash</option>
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>Bank Transfer</option>
            <option>UPI</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input border border-gray-600 rounded-md"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary"
          >
            {loading ? 'Saving...' : (id ? 'Update' : 'Add') + ' Transaction'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
