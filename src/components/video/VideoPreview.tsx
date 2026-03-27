import React, { useState } from 'react';
import { Video, Mic } from 'lucide-react';
import { Button } from '../ui/Button';

interface VideoPreviewProps {
  onStartCall: () => void;
  participantName: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  onStartCall,
  participantName,
}) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState('default');
  const [selectedMicrophone, setSelectedMicrophone] = useState('default');

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Prepare for Call</h2>
      
      {/* Video Preview Container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6 aspect-video">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="text-center">
            <Video size={48} className="text-white mx-auto mb-4 opacity-50" />
            <p className="text-white text-sm opacity-75">Camera Preview</p>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            videoEnabled 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <Video size={16} />
            {videoEnabled ? 'Camera On' : 'Camera Off'}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            audioEnabled 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <Mic size={16} />
            {audioEnabled ? 'Microphone On' : 'Microphone Off'}
          </div>
        </div>
      </div>

      {/* Participant Info */}
      <div className="bg-primary-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">Calling</p>
        <p className="text-lg font-semibold text-gray-900">{participantName}</p>
      </div>

      {/* Camera Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Camera
        </label>
        <select
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="default">Default Camera</option>
          <option value="front">Front Camera</option>
          <option value="back">Back Camera</option>
        </select>
      </div>

      {/* Microphone Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Microphone
        </label>
        <select
          value={selectedMicrophone}
          onChange={(e) => setSelectedMicrophone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="default">Default Microphone</option>
          <option value="headset">Headset Microphone</option>
          <option value="builtin">Built-in Microphone</option>
        </select>
      </div>

      {/* Control Toggles */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={videoEnabled ? 'primary' : 'error'}
          onClick={() => setVideoEnabled(!videoEnabled)}
          className="flex-1"
        >
          <Video size={18} className="mr-2" />
          {videoEnabled ? 'Camera On' : 'Camera Off'}
        </Button>
        <Button
          variant={audioEnabled ? 'primary' : 'error'}
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="flex-1"
        >
          <Mic size={18} className="mr-2" />
          {audioEnabled ? 'Mic On' : 'Mic Off'}
        </Button>
      </div>

      {/* Start Call Button */}
      <Button
        variant="success"
        onClick={onStartCall}
        className="w-full text-lg font-semibold py-3"
      >
        Start Call
      </Button>
    </div>
  );
};
