import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '../ui/Button';

interface VideoCallModalProps {
  callerName: string;
  callerAvatar: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  callerName,
  callerAvatar,
  onAccept,
  onDecline,
}) => {
  const [pulsing, setPulsing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsing((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        {/* Caller Avatar with Pulse */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Pulse Rings */}
            <div
              className={`absolute inset-0 rounded-full border-4 border-primary-500 transition-all duration-500 ${
                pulsing ? 'scale-100 opacity-0' : 'scale-125 opacity-0'
              }`}
            />
            <div
              className={`absolute inset-0 rounded-full border-4 border-primary-400 transition-all duration-500 ${
                pulsing ? 'scale-110 opacity-0' : 'scale-125 opacity-0'
              }`}
            />
            
            {/* Avatar */}
            <img
              src={callerAvatar}
              alt={callerName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
            />
          </div>
        </div>

        {/* Caller Info */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          {callerName}
        </h2>
        <p className="text-center text-gray-500 mb-8">Incoming call...</p>

        {/* Ringing Animation Text */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-1">
            <span className={`inline-block w-1.5 h-1.5 rounded-full bg-primary-500 transition-all duration-500 ${pulsing ? 'opacity-30' : 'opacity-100'}`} />
            <span className={`inline-block w-1.5 h-1.5 rounded-full bg-primary-500 transition-all duration-500 ${pulsing ? 'opacity-100' : 'opacity-30'}`} />
            <span className={`inline-block w-1.5 h-1.5 rounded-full bg-primary-500 transition-all duration-500 ${pulsing ? 'opacity-30' : 'opacity-100'}`} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onDecline}
            className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <PhoneOff size={20} />
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Phone size={20} />
            Accept
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            You can also ignore this call or it will end automatically
          </p>
        </div>
      </div>
    </div>
  );
};
