import React, { useState } from 'react';
import { Users, Minimize2, Maximize2, Settings } from 'lucide-react';

interface VideoCallComponentProps {
  localUserName: string;
  localUserAvatar: string;
  remoteUserName: string;
  remoteUserAvatar: string;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export const VideoCallComponent: React.FC<VideoCallComponentProps> = ({
  localUserName,
  localUserAvatar,
  remoteUserName,
  remoteUserAvatar,
  isFullscreen = false,
  onFullscreenToggle,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={`relative bg-gray-900 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg aspect-video'}`}>
      {/* Main Remote Video */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
          {/* Remote User Video Container */}
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <img
                src={remoteUserAvatar}
                alt={remoteUserName}
                className="w-32 h-32 rounded-full mx-auto mb-4 opacity-75"
              />
              <p className="text-white text-xl font-semibold">{remoteUserName}</p>
              <p className="text-gray-400 text-sm mt-2">Video Call in Progress</p>
            </div>
          </div>

          {/* Screen Share Indicator (if active) */}
          <div className="absolute inset-0 bg-black bg-opacity-40 hidden items-center justify-center" id="screenShareContainer">
            <div className="text-center">
              <p className="text-white text-lg font-semibold mb-4">Screen Sharing</p>
              <div className="w-64 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="relative w-32 h-24 bg-gray-700 rounded-lg border-2 border-white shadow-lg overflow-hidden hover:w-40 hover:h-30 transition-all group">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
            <div className="text-center">
              <img
                src={localUserAvatar}
                alt={localUserName}
                className="w-16 h-16 rounded-full mx-auto mb-2 opacity-90"
              />
              <p className="text-white text-xs font-semibold">{localUserName}</p>
            </div>
          </div>

          {/* PiP Controls - Hidden by default, shown on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onFullscreenToggle}
              className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100"
              title="Toggle fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Top Info Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-white" />
          <span className="text-white font-medium">1 Participant</span>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl p-4 z-30 w-64">
          <h3 className="font-semibold text-gray-900 mb-3">Video Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Camera</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Default Camera</option>
                <option>Front Camera</option>
                <option>Back Camera</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Microphone</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Default Microphone</option>
                <option>Headset</option>
                <option>Built-in</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Default Speaker</option>
                <option>Headphones</option>
                <option>Built-in</option>
              </select>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm text-gray-700">Record this call</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Network Quality Indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          </div>
          <span className="text-white text-xs font-medium ml-1">Good Connection</span>
        </div>
      </div>
    </div>
  );
};
