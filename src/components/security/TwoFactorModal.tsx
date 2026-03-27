import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { OTPInput } from './OTPInput';
import toast from 'react-hot-toast';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  mode: 'setup' | 'verify';
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  mode,
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(
        mode === 'setup'
          ? '2FA enabled successfully!'
          : 'Authentication successful!'
      );
      onVerify(otp);
      setOtp('');
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'setup'
                ? 'Enable Two-Factor Authentication'
                : 'Verify Your Identity'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'setup'
                ? 'Complete setup by entering the code'
                : 'Enter the 6-digit code from your authenticator'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {mode === 'setup' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Use an authenticator app
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  Scan the QR code with Google Authenticator, Microsoft Authenticator, or similar apps
                </p>
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Enter 6-Digit Code
            </label>
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
            />
          </div>

          {/* Backup Codes Info */}
          {mode === 'setup' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                Save backup codes in a secure location. You can use them if you lose access to your authenticator.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
