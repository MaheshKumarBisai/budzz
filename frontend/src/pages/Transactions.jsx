import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { expenseAPI, incomeAPI } from '../services/api';
import TransactionCard from '../components/TransactionCard';
import FilterModal from '../components/FilterModal';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('expense');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [type]);

  const fetchTransactions = async (filters = {}) => {
    try {
      const api = type === 'expense' ? expenseAPI : incomeAPI;
      const response = await api[type === 'expense' ? 'getExpenses' : 'getIncomes']({ search, ...filters });
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
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-lime-500 text-white'
                  : 'bg-transparent border border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setType('income')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                type === 'income'
                  ? 'bg-lime-500 text-white'
                  : 'bg-transparent border border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white'
              }`}
            >
              Incomes
            </button>
          </div>

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="btn-secondary"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => {
          fetchTransactions(filters);
          setIsFilterModalOpen(false);
        }}
        type={type}
      />

      {/* Transactions List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(
            transactions.reduce((acc, txn) => {
              const date = new Date(txn.transaction_date).toDateString();
              if (!acc[date]) {
                acc[date] = [];
              }
              acc[date].push(txn);
              return acc;
            }, {})
          ).map(([date, txns]) => (
            <div key={date}>
              <h2 className="text-lg font-bold mb-2 text-light-gray">{date}</h2>
              <div className="space-y-4">
                {txns.map((txn) => (
                  <TransactionCard
                    key={txn.id}
                    transaction={txn}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
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
