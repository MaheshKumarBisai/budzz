import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { expenseAPI, incomeAPI } from '../services/api';
import TransactionCard from '../components/TransactionCard';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('expense');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [type]);

  const fetchTransactions = async () => {
    try {
      const api = type === 'expense' ? expenseAPI : incomeAPI;
      const response = await api[type === 'expense' ? 'getExpenses' : 'getIncomes']({ search });
      setTransactions(response.data.data[type === 'expense' ? 'expenses' : 'incomes'] || []);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;

    try {
      const api = type === 'expense' ? expenseAPI : incomeAPI;
      await api[type === 'expense' ? 'deleteExpense' : 'deleteIncome'](id);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (transaction) => {
    navigate(`/transactions/edit/${transaction.id}`, { state: { transaction, type } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <button
          onClick={() => navigate('/transactions/add')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setType('expense')}
              className={`px-4 py-2 rounded-lg font-medium ${
                type === 'expense'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/20'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setType('income')}
              className={`px-4 py-2 rounded-lg font-medium ${
                type === 'income'
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700'
              }`}
            >
              Incomes
            </button>
          </div>

          <button
            onClick={fetchTransactions}
            className="btn-secondary"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((txn) => (
            <TransactionCard
              key={txn.id}
              transaction={txn}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500">No transactions found</p>
          <button
            onClick={() => navigate('/transactions/add')}
            className="btn-primary mt-4"
          >
            Add your first transaction
          </button>
        </div>
      )}
    </div>
  );
}
