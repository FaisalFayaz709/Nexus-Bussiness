import { ConfirmedMeeting } from '../types';

export const confirmedMeetings: ConfirmedMeeting[] = [
  {
    id: 'meeting_1',
    participantIds: ['user_1', 'user_2'],
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    title: 'Investment Discussion with John',
    description: 'Discuss Series A funding opportunities and growth strategy.',
    meetingLink: 'https://meet.example.com/meeting_1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'meeting_2',
    participantIds: ['user_1', 'user_3'],
    startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    title: 'Product Demo with Sarah',
    description: 'Showcase our new product features and roadmap.',
    meetingLink: 'https://meet.example.com/meeting_2',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'meeting_3',
    participantIds: ['user_2', 'user_4'],
    startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    title: 'Due Diligence Review',
    description: 'Financial and legal review meeting.',
    meetingLink: 'https://meet.example.com/meeting_3',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
