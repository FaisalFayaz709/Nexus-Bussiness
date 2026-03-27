import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { PasswordStrengthMeter } from '../../components/security/PasswordStrengthMeter';
import { TwoFactorModal } from '../../components/security/TwoFactorModal';
import toast from 'react-hot-toast';

export const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [twoFaModal, setTwoFaModal] = useState(false);
  const [twoFaMode, setTwoFaMode] = useState<'setup' | 'verify'>('setup');
  const [loadingPassword, setLoadingPassword] = useState(false);

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoadingPassword(true);

    // Simulate API call
    setTimeout(() => {
      setLoadingPassword(false);
      toast.success('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1500);
  };

  const handleTwoFaToggle = () => {
    if (!twoFaEnabled) {
      setTwoFaMode('setup');
      setTwoFaModal(true);
    } else {
      setTwoFaEnabled(false);
      toast.success('Two-factor authentication disabled');
    }
  };

  const handleTwoFaVerify = (otp: string) => {
    setTwoFaEnabled(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account security and privacy
        </p>
      </div>

      {/* Change Password */}
      <Card>
        <CardHeader className="flex items-center gap-3">
          <Lock size={24} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordForm.newPassword && (
                <PasswordStrengthMeter password={passwordForm.newPassword} />
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loadingPassword}>
              {loadingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Two-Factor Authentication
            </h2>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              twoFaEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {twoFaEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 mb-4">
            {twoFaEnabled
              ? 'Two-factor authentication is enabled on your account. You will need to enter a code from your authenticator app when you log in.'
              : 'Two-factor authentication adds an extra layer of security to your account. You will need a code from an authenticator app to log in.'}
          </p>
          <Button
            variant={twoFaEnabled ? 'outline' : 'default'}
            onClick={handleTwoFaToggle}
          >
            {twoFaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
        </CardBody>
      </Card>

      {/* Login Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Chrome on MacOS</p>
                <p className="text-sm text-gray-600">
                  Last active: Today at 2:30 PM
                </p>
              </div>
              <span className="text-green-600 text-sm font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Safari on iPhone</p>
                <p className="text-sm text-gray-600">
                  Last active: Yesterday at 5:15 PM
                </p>
              </div>
              <button className="text-red-600 text-sm font-medium hover:underline">
                Remove
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Firefox on Windows</p>
                <p className="text-sm text-gray-600">
                  Last active: 2 days ago
                </p>
              </div>
              <button className="text-red-600 text-sm font-medium hover:underline">
                Remove
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Two-Factor Modal */}
      <TwoFactorModal
        isOpen={twoFaModal}
        onClose={() => setTwoFaModal(false)}
        onVerify={handleTwoFaVerify}
        mode={twoFaMode}
      />
    </div>
  );
};
