import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { expenseAPI, incomeAPI } from '../services/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';

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
      <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{id ? 'Edit' : 'Add'} Transaction</h1>

      <form onSubmit={handleSubmit} className="bg-card dark:bg-dark-card p-8 rounded-2xl shadow-lg space-y-6">
        {/* Type Selection */}
        {!id && (
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Type</label>
            <div className="flex space-x-4">
              <Button
                type="button"
                onClick={() => { setType('expense'); setCategoryId(''); }}
                variant={type === 'expense' ? 'primary' : 'secondary'}
                className="flex-1"
              >
                Expense
              </Button>
              <Button
                type="button"
                onClick={() => { setType('income'); setCategoryId(''); }}
                variant={type === 'income' ? 'primary' : 'secondary'}
                className="flex-1"
              >
                Income
              </Button>
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
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
          <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
            placeholder="0.00"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
            rows="3"
            placeholder="Add notes..."
          />
        </div>

        {/* Payment Mode */}
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Payment Mode</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
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
          <label className="block text-sm font-medium mb-2 text-text-primary dark:text-dark-text-primary">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : (id ? 'Update' : 'Add') + ' Transaction'}
          </Button>
          <Button
            type="button"
            onClick={() => navigate('/transactions')}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
