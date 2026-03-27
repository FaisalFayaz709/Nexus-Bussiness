import React from 'react';
import { MeetingRequest, User } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface MeetingRequestCardProps {
  request: MeetingRequest;
  requester: User;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

export const MeetingRequestCard: React.FC<MeetingRequestCardProps> = ({
  request,
  requester,
  onAccept,
  onDecline,
}) => {
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
  };

  const statusIcon = {
    pending: <Clock size={16} />,
    accepted: <CheckCircle size={16} />,
    declined: <XCircle size={16} />,
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <img
            src={requester.avatarUrl}
            alt={requester.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{requester.name}</h3>
            <p className="text-sm text-gray-500">{requester.email}</p>
          </div>
        </div>
        <Badge className={statusColor[request.status]}>
          <span className="inline-flex items-center gap-1">
            {statusIcon[request.status]}
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </Badge>
      </div>

      <div className="mb-3">
        <p className="text-gray-700 text-sm mb-3">{request.message}</p>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs font-medium text-gray-600 mb-1">Proposed Time</p>
          <p className="text-sm text-gray-900">
            {format(parseISO(request.proposedStartTime), 'MMM dd, yyyy')} at{' '}
            {format(parseISO(request.proposedStartTime), 'h:mm a')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Duration: {Math.round((new Date(request.proposedEndTime).getTime() - new Date(request.proposedStartTime).getTime()) / 60000)} minutes
          </p>
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="flex gap-2">
          <Button
            onClick={() => onAccept(request.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Accept
          </Button>
          <Button
            onClick={() => onDecline(request.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Decline
          </Button>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Sent {format(parseISO(request.createdAt), 'MMM dd, yyyy')}
      </div>
    </Card>
  );
};
