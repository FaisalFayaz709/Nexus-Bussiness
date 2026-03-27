import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ConfirmedMeeting, AvailabilitySlot } from '../../types';

interface CalendarProps {
  meetings: ConfirmedMeeting[];
  availability: AvailabilitySlot[];
  onDateSelect?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  meetings,
  availability,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMeetingsForDay = (date: Date) => {
    return meetings.filter((m) => {
      const meetingDate = new Date(m.startTime);
      return isSameDay(meetingDate, date);
    });
  };

  const getAvailabilityForDay = (date: Date) => {
    return availability.filter((a) => a.dayOfWeek === date.getDay());
  };

  const hasEvents = (date: Date) => {
    return getMeetingsForDay(date).length > 0 || getAvailabilityForDay(date).length > 0;
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map((label) => (
            <div
              key={label}
              className="text-center text-sm font-semibold text-gray-600 py-2"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayMeetings = getMeetingsForDay(day);
            const dayAvailability = getAvailabilityForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={day.toString()}
                onClick={() => onDateSelect?.(day)}
                className={`
                  min-h-24 p-2 rounded-md border border-gray-200 text-sm
                  transition-all duration-200
                  ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 text-gray-400'}
                  ${isToday ? 'border-primary-500 bg-primary-50' : ''}
                  ${!isCurrentMonth ? 'pointer-events-none' : ''}
                `}
              >
                <div className="font-medium text-gray-900">{format(day, 'd')}</div>
                <div className="mt-1 space-y-1">
                  {dayMeetings.slice(0, 2).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="text-xs bg-primary-100 text-primary-700 rounded px-1 py-0.5 truncate"
                    >
                      {meeting.title}
                    </div>
                  ))}
                  {dayAvailability.length > 0 && (
                    <div className="text-xs bg-secondary-100 text-secondary-700 rounded px-1 py-0.5">
                      Available
                    </div>
                  )}
                  {dayMeetings.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayMeetings.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary-100 border border-primary-500"></div>
            <span className="text-gray-700">Meetings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-secondary-100 border border-secondary-500"></div>
            <span className="text-gray-700">Availability</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
