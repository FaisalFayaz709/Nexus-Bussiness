import { Signature } from '../types';

export const signatures: Signature[] = [
  {
    id: 'sig-1',
    documentId: 'doc-2',
    signerId: 'user-1',
    signerName: 'John Entrepreneur',
    signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    status: 'signed',
  },
  {
    id: 'sig-2',
    documentId: 'doc-2',
    signerId: 'user-2',
    signerName: 'Jane Investor',
    signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'signed',
  },
  {
    id: 'sig-3',
    documentId: 'doc-1',
    signerId: 'user-1',
    signerName: 'John Entrepreneur',
    signatureData: '',
    timestamp: new Date().toISOString(),
    status: 'pending',
  },
  {
    id: 'sig-4',
    documentId: 'doc-5',
    signerId: 'user-1',
    signerName: 'John Entrepreneur',
    signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    status: 'signed',
  },
  {
    id: 'sig-5',
    documentId: 'doc-5',
    signerId: 'user-2',
    signerName: 'Jane Investor',
    signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    status: 'signed',
  },
];
