import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { expenseAPI, incomeAPI } from '../services/api';
import TransactionCard from '../components/TransactionCard';
import FilterModal from '../components/FilterModal';
import Button from '../components/Button';
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
        <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Transactions</h1>
        <Button onClick={() => navigate('/transactions/add')} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Transaction</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card dark:bg-dark-card p-4 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-transparent border-border dark:border-dark-border"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => setType('expense')}
              variant={type === 'expense' ? 'primary' : 'secondary'}
            >
              Expenses
            </Button>
            <Button
              onClick={() => setType('income')}
              variant={type === 'income' ? 'primary' : 'secondary'}
            >
              Incomes
            </Button>
          </div>

          <Button onClick={() => setIsFilterModalOpen(true)} variant="accent">
            <Filter size={20} />
          </Button>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
              <h2 className="text-lg font-bold mb-2 text-text-secondary dark:text-dark-text-secondary">{date}</h2>
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
        <div className="bg-card dark:bg-dark-card text-center py-12 rounded-2xl shadow-lg">
          <p className="text-text-secondary dark:text-dark-text-secondary">No transactions found</p>
          <Button onClick={() => navigate('/transactions/add')} className="mt-4">
            Add your first transaction
          </Button>
        </div>
      )}
    </div>
  );
}
