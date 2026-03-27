import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Send } from 'lucide-react';
import { WalletTransaction } from '../../types';
import { Badge } from '../ui/Badge';
import { format, parseISO } from 'date-fns';

interface TransactionCardProps {
  transaction: WalletTransaction;
  currentUserId: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  currentUserId,
}) => {
  const isIncoming = transaction.receiverId === currentUserId;
  const otherPartyName = isIncoming
    ? transaction.senderName
    : transaction.receiverName;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = () => {
    switch (transaction.type) {
      case 'deposit':
      case 'deal_funding':
        return <ArrowDownLeft size={20} className="text-green-600" />;
      case 'transfer':
        return <Send size={20} className="text-blue-600" />;
      case 'withdraw':
        return <ArrowUpRight size={20} className="text-red-600" />;
      default:
        return <ArrowUpRight size={20} className="text-gray-600" />;
    }
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: transaction.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const typeLabel = transaction.type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 flex-1">
        <div className="p-3 bg-gray-100 rounded-full">{getTypeIcon()}</div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{otherPartyName}</p>
          <p className="text-sm text-gray-600">{typeLabel}</p>
          <p className="text-xs text-gray-500">
            {format(parseISO(transaction.timestamp), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
      </div>

      <div className="text-right flex items-center gap-4">
        <div>
          <p
            className={`font-semibold text-lg ${
              isIncoming ? 'text-green-600' : 'text-gray-900'
            }`}
          >
            {isIncoming ? '+' : '-'}
            {formatAmount(transaction.amount)}
          </p>
          <Badge
            variant={transaction.status === 'completed' ? 'success' : 'default'}
          >
            {transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)}
          </Badge>
        </div>
      </div>
    </div>
  );
};
