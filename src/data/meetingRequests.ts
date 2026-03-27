import { MeetingRequest } from '../types';

export const meetingRequests: MeetingRequest[] = [
  {
    id: 'req_1',
    senderId: 'user_1',
    receiverId: 'user_2',
    proposedStartTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    proposedEndTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    message: 'I would like to discuss potential investment opportunities in your startup.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'req_2',
    senderId: 'user_3',
    receiverId: 'user_1',
    proposedStartTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    proposedEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    message: 'Interested in learning more about your business model.',
    status: 'accepted',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    respondedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'req_3',
    senderId: 'user_2',
    receiverId: 'user_4',
    proposedStartTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    proposedEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    message: 'Let us discuss partnership opportunities.',
    status: 'declined',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
