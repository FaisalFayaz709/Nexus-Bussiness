import { AvailabilitySlot } from '../types';

export const availabilitySlots: AvailabilitySlot[] = [
  {
    id: 'avail_1',
    userId: 'user_1',
    startTime: '09:00',
    endTime: '11:00',
    dayOfWeek: 1, // Monday
    isRecurring: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'avail_2',
    userId: 'user_1',
    startTime: '14:00',
    endTime: '16:00',
    dayOfWeek: 3, // Wednesday
    isRecurring: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'avail_3',
    userId: 'user_2',
    startTime: '10:00',
    endTime: '12:00',
    dayOfWeek: 2, // Tuesday
    isRecurring: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'avail_4',
    userId: 'user_2',
    startTime: '15:00',
    endTime: '17:00',
    dayOfWeek: 4, // Thursday
    isRecurring: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
