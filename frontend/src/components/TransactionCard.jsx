import { Edit, Trash2 } from 'lucide-react';

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const isExpense = transaction.type === 'expense';

  return (
    <div className="card flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
          isExpense ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'
        }`}>
          {transaction.category_icon || (isExpense ? '💸' : '💰')}
        </div>

        <div>
          <h3 className="font-medium">{transaction.category_name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {transaction.description || 'No description'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {new Date(transaction.transaction_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className={`text-lg font-semibold ${
          isExpense ? 'text-red-600' : 'text-green-600'
        }`}>
          {isExpense ? '-' : '+'}${parseFloat(transaction.amount).toFixed(2)}
        </span>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
