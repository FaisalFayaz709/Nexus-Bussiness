import { VideoCallSession } from '../types';

export const videoSessions: VideoCallSession[] = [
  {
    id: 'vc-1',
    initiatorId: 'user-1',
    participantId: 'user-2',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    status: 'incoming',
    isRecording: false,
  },
  {
    id: 'vc-2',
    initiatorId: 'user-1',
    participantId: 'user-3',
    startTime: new Date(Date.now() + 7200000).toISOString(),
    status: 'incoming',
    isRecording: false,
  },
  {
    id: 'vc-3',
    initiatorId: 'user-2',
    participantId: 'user-1',
    startTime: new Date(Date.now() - 1800000).toISOString(),
    endTime: new Date(Date.now() - 600000).toISOString(),
    status: 'completed',
    isRecording: true,
    duration: 1200,
  },
  {
    id: 'vc-4',
    initiatorId: 'user-3',
    participantId: 'user-1',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 82800000).toISOString(),
    status: 'completed',
    isRecording: false,
    duration: 3600,
  },
];
