import React from 'react';
import { CreditCard, Eye, EyeOff } from 'lucide-react';
import { WalletBalance } from '../../types';

interface WalletCardProps {
  balance: WalletBalance;
  showBalance: boolean;
  onToggleVisibility: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  showBalance,
  onToggleVisibility,
}) => {
  const formatBalance = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: balance.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white shadow-lg">
      <div className="flex items-start justify-between mb-12">
        <div>
          <p className="text-primary-100 text-sm font-medium mb-1">Total Balance</p>
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold">
              {showBalance ? formatBalance(balance.balance) : '••••••'}
            </h2>
            <button
              onClick={onToggleVisibility}
              className="p-2 hover:bg-primary-500 rounded-lg transition-colors"
              aria-label="Toggle balance visibility"
            >
              {showBalance ? (
                <Eye size={20} className="text-primary-100" />
              ) : (
                <EyeOff size={20} className="text-primary-100" />
              )}
            </button>
          </div>
        </div>
        <div className="p-3 bg-primary-500 rounded-lg">
          <CreditCard size={24} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-primary-100 text-xs font-medium mb-1">Card Number</p>
          <p className="text-lg font-semibold">•••• •••• •••• 4892</p>
        </div>
        <div className="text-right">
          <p className="text-primary-100 text-xs font-medium mb-1">Expires</p>
          <p className="text-lg font-semibold">12/26</p>
        </div>
      </div>
    </div>
  );
};
