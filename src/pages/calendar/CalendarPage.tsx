import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar } from '../../components/calendar/Calendar';
import { ConfirmedMeetingCard } from '../../components/calendar/ConfirmedMeetingCard';
import { confirmedMeetings } from '../../data/confirmedMeetings';
import { availabilitySlots } from '../../data/availabilitySlots';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CalendarPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter, startOfToday } from 'date-fns';

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get upcoming meetings for current user
  const upcomingMeetings = confirmedMeetings
    .filter((m) => m.participantIds.includes(user?.id || ''))
    .filter((m) => isAfter(parseISO(m.startTime), startOfToday()))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Get user's availability
  const userAvailability = availabilitySlots.filter((s) => s.userId === user?.id);

  // Get meetings for selected date
  const selectedDateMeetings = selectedDate
    ? upcomingMeetings.filter((m) => {
        const meetingDate = new Date(m.startTime);
        return (
          meetingDate.getFullYear() === selectedDate.getFullYear() &&
          meetingDate.getMonth() === selectedDate.getMonth() &&
          meetingDate.getDate() === selectedDate.getDate()
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-600 mt-2">Manage your meetings and availability</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/calendar/availability')}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white"
            >
              <CalendarPlus size={18} />
              Manage Availability
            </Button>
            <Button
              onClick={() => navigate('/calendar/requests')}
              className="flex items-center gap-2 bg-secondary-600 hover:bg-secondary-700 text-white"
            >
              <Users size={18} />
              Meeting Requests
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              meetings={upcomingMeetings}
              availability={userAvailability}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Upcoming Meetings */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Meetings</h2>
              {upcomingMeetings.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-600">No upcoming meetings scheduled</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingMeetings.slice(0, 5).map((meeting) => (
                    <ConfirmedMeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                  {upcomingMeetings.length > 5 && (
                    <Button
                      onClick={() => {/* scroll to see more */}}
                      className="w-full text-primary-600 hover:text-primary-700"
                    >
                      View all meetings
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Your Availability */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Availability</h2>
              {userAvailability.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-600 mb-4">
                    No availability slots set yet
                  </p>
                  <Button
                    onClick={() => navigate('/calendar/availability')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    Add Availability
                  </Button>
                </Card>
              ) : (
                <Card className="p-4 space-y-3">
                  {userAvailability.map((slot) => {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{days[slot.dayOfWeek]}</p>
                          <p className="text-sm text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                        {slot.isRecurring && (
                          <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                            Recurring
                          </span>
                        )}
                      </div>
                    );
                  })}
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Selected Date Meetings */}
        {selectedDate && selectedDateMeetings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Meetings on {format(selectedDate, 'MMMM dd, yyyy')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedDateMeetings.map((meeting) => (
                <ConfirmedMeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
