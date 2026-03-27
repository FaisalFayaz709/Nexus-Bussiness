import { WalletBalance } from '../types';

export const walletBalances: WalletBalance[] = [
  {
    userId: 'user_001',
    balance: 487500,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  {
    userId: 'user_002',
    balance: 1250000,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  {
    userId: 'user_003',
    balance: 5000000,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
  {
    userId: 'user_004',
    balance: 375000,
    currency: 'USD',
    lastUpdated: new Date().toISOString(),
  },
];
