import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Send, Download, MoreVertical } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { WalletCard } from '../../components/payment/WalletCard';
import { TransactionHistory } from '../../components/payment/TransactionHistory';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { walletBalances } from '../../data/walletBalances';
import { walletTransactions } from '../../data/walletTransactions';

export const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    type?: 'deposit' | 'withdraw' | 'transfer';
  }>({ isOpen: false });

  if (!user) return null;

  const userBalance = walletBalances.find((wb) => wb.userId === user.id) || {
    userId: user.id,
    balance: 0,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  };

  const userTransactions = walletTransactions.filter(
    (txn) => txn.senderId === user.id || txn.receiverId === user.id
  );

  const openPaymentModal = (type: 'deposit' | 'withdraw' | 'transfer') => {
    setPaymentModal({ isOpen: true, type });
  };

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600 mt-2">Manage your funds and transactions</p>
      </div>

      {/* Wallet Card */}
      <WalletCard
        balance={userBalance}
        showBalance={showBalance}
        onToggleVisibility={() => setShowBalance(!showBalance)}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => openPaymentModal('deposit')}
          className="flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Funds
        </Button>
        <Button
          variant="outline"
          onClick={() => openPaymentModal('transfer')}
          className="flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Transfer
        </Button>
        <Button
          variant="outline"
          onClick={() => openPaymentModal('withdraw')}
          className="flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Withdraw
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-2">Total Deposits</p>
            <p className="text-2xl font-bold text-green-600">
              ${(userBalance.balance * 0.15).toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-2">Total Withdrawals</p>
            <p className="text-2xl font-bold text-red-600">
              ${(userBalance.balance * 0.05).toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-2">Monthly Transactions</p>
            <p className="text-2xl font-bold text-blue-600">
              {userTransactions.length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction History
          </h2>
          <Link
            to="/wallet/payment"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All
          </Link>
        </CardHeader>
        <CardBody>
          <TransactionHistory
            transactions={userTransactions.slice(0, 5)}
            currentUserId={user.id}
          />
        </CardBody>
      </Card>

      {/* Payment Modal */}
      {paymentModal.type && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={closePaymentModal}
          type={paymentModal.type}
        />
      )}
    </div>
  );
};
