import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VideoCallComponent } from '../../components/video/VideoCallComponent';
import { CallControls } from '../../components/video/CallControls';
import { VideoPreview } from '../../components/video/VideoPreview';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../data/users';

export const VideoCallPage: React.FC = () => {
  const { callId } = useParams<{ callId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [callStatus, setCallStatus] = useState<'setup' | 'active' | 'ended'>('setup');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock participant
  const remoteUser = users.find((u) => u.id === 'user-2') || users[1];

  const handleStartCall = () => {
    setCallStatus('active');
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigate('/dashboard/entrepreneur');
    }, 2000);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {callStatus === 'setup' ? 'Preparing Video Call' : 'Video Call'}
              </h1>
              <p className="text-sm text-gray-500">
                {callStatus === 'setup' && 'Set up your camera and microphone'}
                {callStatus === 'active' && `In call with ${remoteUser.name}`}
                {callStatus === 'ended' && 'Call ended'}
              </p>
            </div>
          </div>

          {callStatus !== 'setup' && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Call ID: {callId}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {callStatus === 'setup' && (
          <div className="flex justify-center">
            <VideoPreview
              onStartCall={handleStartCall}
              participantName={remoteUser.name}
            />
          </div>
        )}

        {callStatus === 'active' && (
          <div className="space-y-8">
            {/* Main Video Call Area */}
            <div className={isFullscreen ? 'fixed inset-0 z-50 pt-0' : 'rounded-lg overflow-hidden'}>
              <VideoCallComponent
                localUserName={user.name}
                localUserAvatar={user.avatarUrl}
                remoteUserName={remoteUser.name}
                remoteUserAvatar={remoteUser.avatarUrl}
                isFullscreen={isFullscreen}
                onFullscreenToggle={handleFullscreenToggle}
              />
            </div>

            {!isFullscreen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Call Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Call Information</h3>
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="text-gray-600">With</dt>
                      <dd className="font-medium text-gray-900">{remoteUser.name}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Status</dt>
                      <dd className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="font-medium text-gray-900">Connected</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-600">Network Quality</dt>
                      <dd className="font-medium text-green-700">Excellent</dd>
                    </div>
                  </dl>
                </div>

                {/* Participant List */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Participants</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">You</p>
                      </div>
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={remoteUser.avatarUrl}
                        alt={remoteUser.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{remoteUser.name}</p>
                        <p className="text-xs text-gray-500">Guest</p>
                      </div>
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                </div>

                {/* Recent Calls */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
                      💬 Open Chat
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
                      📎 Share File
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
                      📱 Invite Others
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700">
                      ⏹️ Record Call
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {callStatus === 'ended' && (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Call Ended</h2>
            <p className="text-gray-600 mb-6">Thanks for the call with {remoteUser.name}!</p>
            <button
              onClick={() => navigate('/dashboard/entrepreneur')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Call Controls (shown during active call) */}
      {callStatus === 'active' && (
        <CallControls
          onEndCall={handleEndCall}
          participantName={remoteUser.name}
        />
      )}
    </div>
  );
};
