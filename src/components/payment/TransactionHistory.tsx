import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { WalletTransaction } from '../../types';
import { TransactionCard } from './TransactionCard';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TransactionHistoryProps {
  transactions: WalletTransaction[];
  currentUserId: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'all' || txn.type === filterType;
      const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchQuery, filterType, filterStatus]);

  const transactionTypes = ['all', ...new Set(transactions.map((t) => t.type))];
  const transactionStatuses = ['all', ...new Set(transactions.map((t) => t.status))];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {transactionTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all'
                    ? 'All Types'
                    : type
                        .split('_')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {transactionStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all'
                    ? 'All Statuses'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          <>
            <p className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {transactions.length}{' '}
              transactions
            </p>
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                currentUserId={currentUserId}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No transactions found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
