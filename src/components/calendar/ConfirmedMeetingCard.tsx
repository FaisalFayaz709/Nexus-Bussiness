import React from 'react';
import { ConfirmedMeeting } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { format, parseISO } from 'date-fns';
import { Clock, Users, Link, MapPin } from 'lucide-react';

interface ConfirmedMeetingCardProps {
  meeting: ConfirmedMeeting;
}

export const ConfirmedMeetingCard: React.FC<ConfirmedMeetingCardProps> = ({ meeting }) => {
  const startDate = parseISO(meeting.startTime);
  const endDate = parseISO(meeting.endTime);
  const duration = Math.round((endDate.getTime() - startDate.getTime()) / 60000);

  return (
    <Card className="p-4 border-l-4 border-l-primary-600 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{meeting.title}</h3>
          {meeting.description && (
            <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
          )}
        </div>
        <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock size={16} className="text-gray-400" />
          <span>
            {format(startDate, 'MMM dd, yyyy')} at {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
          </span>
          <span className="text-gray-500">({duration} min)</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Users size={16} className="text-gray-400" />
          <span>{meeting.participantIds.length} participants</span>
        </div>

        {meeting.meetingLink && (
          <div className="flex items-center gap-2 text-sm">
            <Link size={16} className="text-gray-400" />
            <a
              href={meeting.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              Join Meeting
            </a>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-600">
        <p>Created {format(parseISO(meeting.createdAt), 'MMM dd, yyyy')}</p>
      </div>
    </Card>
  );
};
