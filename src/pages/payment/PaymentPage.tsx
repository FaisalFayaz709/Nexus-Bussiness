import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { TransactionHistory } from '../../components/payment/TransactionHistory';
import { walletTransactions } from '../../data/walletTransactions';

export const PaymentPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const userTransactions = walletTransactions.filter(
    (txn) => txn.senderId === user.id || txn.receiverId === user.id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">
          View and manage all your transactions
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">
              {userTransactions.length}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {userTransactions.filter((t) => t.status === 'completed').length}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {userTransactions.filter((t) => t.status === 'pending').length}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {userTransactions.filter((t) => t.status === 'failed').length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Full Transaction History */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            All Transactions
          </h2>
        </CardHeader>
        <CardBody>
          <TransactionHistory
            transactions={userTransactions}
            currentUserId={user.id}
          />
        </CardBody>
      </Card>
    </div>
  );
};
