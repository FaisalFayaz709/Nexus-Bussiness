import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw' | 'transfer';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (type === 'transfer' && !recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(
        `${type === 'deposit' ? 'Deposit' : type === 'withdraw' ? 'Withdrawal' : 'Transfer'} request submitted successfully!`
      );
      handleReset();
      onClose();
    }, 1500);
  };

  const handleReset = () => {
    setAmount('');
    setRecipientEmail('');
    setDescription('');
  };

  const getTitle = (): string => {
    switch (type) {
      case 'deposit':
        return 'Add Funds';
      case 'withdraw':
        return 'Withdraw Funds';
      case 'transfer':
        return 'Transfer Funds';
      default:
        return 'Payment';
    }
  };

  const getDescription = (): string => {
    switch (type) {
      case 'deposit':
        return 'Add funds to your wallet';
      case 'withdraw':
        return 'Withdraw funds from your wallet';
      case 'transfer':
        return 'Send funds to another user';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {getTitle()}
            </h2>
            <p className="text-sm text-gray-600">{getDescription()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {type === 'withdraw' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                Withdrawals may take 1-2 business days to appear in your account.
              </p>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Recipient Email (for transfers) */}
          {type === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email
              </label>
              <Input
                type="email"
                placeholder="recipient@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : getTitle()}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
