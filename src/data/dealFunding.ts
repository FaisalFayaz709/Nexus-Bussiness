import { DealFunding } from '../types';

export const dealFunding: DealFunding[] = [
  {
    id: 'deal_001',
    investorId: 'user_003',
    entrepreneurId: 'user_001',
    dealId: 'startup_001',
    amount: 250000,
    status: 'accepted',
    fundingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'deal_002',
    investorId: 'user_002',
    entrepreneurId: 'user_004',
    dealId: 'startup_002',
    amount: 500000,
    status: 'under_review',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'deal_003',
    investorId: 'user_003',
    entrepreneurId: 'user_004',
    dealId: 'startup_003',
    amount: 150000,
    status: 'proposed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
