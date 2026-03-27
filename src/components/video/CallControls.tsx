import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Share2, Phone, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface CallControlsProps {
  onEndCall: () => void;
  participantName: string;
}

export const CallControls: React.FC<CallControlsProps> = ({
  onEndCall,
  participantName,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Call timer
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      {/* Expanded Controls */}
      {isExpanded && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-6 mb-4 min-w-80">
          {/* Call Info */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">In call with</p>
            <p className="text-lg font-semibold text-gray-900">{participantName}</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-primary-600 font-mono">
              <Clock size={18} />
              {formatDuration(duration)}
            </div>
          </div>

          {/* Control Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                audioEnabled
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {audioEnabled ? (
                <>
                  <Mic size={20} />
                  <span>Mute</span>
                </>
              ) : (
                <>
                  <MicOff size={20} />
                  <span>Unmute</span>
                </>
              )}
            </button>

            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                videoEnabled
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {videoEnabled ? (
                <>
                  <Video size={20} />
                  <span>Stop Video</span>
                </>
              ) : (
                <>
                  <VideoOff size={20} />
                  <span>Start Video</span>
                </>
              )}
            </button>

            <button
              onClick={() => setScreenShareActive(!screenShareActive)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors col-span-2 ${
                screenShareActive
                  ? 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Share2 size={20} />
              <span>{screenShareActive ? 'Stop Sharing' : 'Share Screen'}</span>
            </button>
          </div>

          {/* End Call Button */}
          <Button
            variant="error"
            onClick={onEndCall}
            className="w-full"
          >
            <Phone size={20} className="mr-2" />
            End Call
          </Button>
        </div>
      )}

      {/* Floating Control Bar */}
      <div className="flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-3">
        {/* Mini Status */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${audioEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className={`w-2 h-2 rounded-full ${videoEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
        </div>

        {/* Duration */}
        <div className="text-sm font-mono text-gray-600 px-2">
          {formatDuration(duration)}
        </div>

        {/* Quick Toggle Buttons */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-2 rounded-full transition-colors ${
            audioEnabled ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
          title={audioEnabled ? 'Mute' : 'Unmute'}
        >
          {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={() => setVideoEnabled(!videoEnabled)}
          className={`p-2 rounded-full transition-colors ${
            videoEnabled ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
          title={videoEnabled ? 'Stop Video' : 'Start Video'}
        >
          {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Phone size={20} className={isExpanded ? 'text-red-500' : ''} />
        </button>
      </div>
    </div>
  );
};
