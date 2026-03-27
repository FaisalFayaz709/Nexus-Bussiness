import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MeetingRequestCard } from '../../components/calendar/MeetingRequestCard';
import { MeetingRequestForm } from '../../components/calendar/MeetingRequestForm';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MeetingRequest, User } from '../../types';
import { meetingRequests } from '../../data/meetingRequests';
import { users } from '../../data/users';
import { Users, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const MeetingRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MeetingRequest[]>(meetingRequests);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  // Get requests for current user (received and sent)
  const receivedRequests = useMemo(() => {
    return requests
      .filter((r) => r.receiverId === user?.id)
      .filter((r) => filterStatus === 'all' || r.status === filterStatus)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, user?.id, filterStatus]);

  const sentRequests = useMemo(() => {
    return requests
      .filter((r) => r.senderId === user?.id)
      .filter((r) => filterStatus === 'all' || r.status === filterStatus)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, user?.id, filterStatus]);

  const pendingCount = requests.filter(
    (r) => (r.receiverId === user?.id || r.senderId === user?.id) && r.status === 'pending'
  ).length;

  const handleAccept = (requestId: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? { ...r, status: 'accepted', respondedAt: new Date().toISOString() }
          : r
      )
    );
    toast.success('Meeting request accepted!');
  };

  const handleDecline = (requestId: string) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? { ...r, status: 'declined', respondedAt: new Date().toISOString() }
          : r
      )
    );
    toast.success('Meeting request declined!');
  };

  const handleSendRequest = (data: {
    message: string;
    proposedStartTime: string;
    proposedEndTime: string;
  }) => {
    if (!selectedRecipient) return;

    const newRequest: MeetingRequest = {
      id: `req_${Date.now()}`,
      senderId: user?.id || '',
      receiverId: selectedRecipient.id,
      proposedStartTime: data.proposedStartTime,
      proposedEndTime: data.proposedEndTime,
      message: data.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setRequests([...requests, newRequest]);
    toast.success('Meeting request sent!');
    setShowRequestForm(false);
    setSelectedRecipient(null);
  };

  const handleStartRequest = (recipient: User) => {
    setSelectedRecipient(recipient);
    setShowRequestForm(true);
  };

  // Get other users for the "Send Request" feature
  const otherUsers = users.filter((u) => u.id !== user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meeting Requests</h1>
            <p className="text-gray-600 mt-2">Manage and respond to meeting requests</p>
            {pendingCount > 0 && (
              <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <Button
            onClick={() => navigate('/calendar')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Calendar
          </Button>
        </div>

        {/* Send Request Section */}
        {!showRequestForm ? (
          <div className="mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send size={20} className="text-primary-600" />
                Request a Meeting
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherUsers.map((otherUser) => (
                  <Card
                    key={otherUser.id}
                    className="p-4 border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleStartRequest(otherUser)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={otherUser.avatarUrl}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{otherUser.name}</p>
                        <p className="text-xs text-gray-500">{otherUser.role}</p>
                      </div>
                    </div>
                    <Button className="w-full text-primary-600 hover:text-primary-700 text-sm">
                      Request Meeting
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="mb-8 max-w-2xl">
            <MeetingRequestForm
              recipientName={selectedRecipient?.name || ''}
              onSubmit={handleSendRequest}
              onCancel={() => {
                setShowRequestForm(false);
                setSelectedRecipient(null);
              }}
            />
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <Button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            All
          </Button>
          <Button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Pending
          </Button>
          <Button
            onClick={() => setFilterStatus('accepted')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filterStatus === 'accepted'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Accepted
          </Button>
          <Button
            onClick={() => setFilterStatus('declined')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filterStatus === 'declined'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            Declined
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Received Requests */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={24} />
              Received Requests
            </h2>
            {receivedRequests.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No received requests</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {receivedRequests.map((request) => {
                  const requester = users.find((u) => u.id === request.senderId);
                  return (
                    requester && (
                      <MeetingRequestCard
                        key={request.id}
                        request={request}
                        requester={requester}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                      />
                    )
                  );
                })}
              </div>
            )}
          </div>

          {/* Sent Requests */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sent Requests</h2>
            {sentRequests.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No sent requests</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {sentRequests.map((request) => {
                  const recipient = users.find((u) => u.id === request.receiverId);
                  return (
                    recipient && (
                      <MeetingRequestCard
                        key={request.id}
                        request={request}
                        requester={recipient}
                        onAccept={() => {}}
                        onDecline={() => {}}
                      />
                    )
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
