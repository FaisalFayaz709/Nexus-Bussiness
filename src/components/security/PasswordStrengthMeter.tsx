import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { PasswordStrength } from '../../types';

interface PasswordStrengthMeterProps {
  password: string;
  onStrengthChange?: (strength: PasswordStrength) => void;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  onStrengthChange,
}) => {
  const strength = useMemo((): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (!password) {
      return { level: 'weak', score: 0, feedback: [] };
    }

    // Length checks
    if (password.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    else if (password.length >= 8) feedback.push('12+ characters makes it stronger');

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Add uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Add numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Add special characters (!@#$%^&*)');

    // Determine level
    let level: 'weak' | 'fair' | 'good' | 'strong';
    if (score <= 2) {
      level = 'weak';
    } else if (score <= 3) {
      level = 'fair';
    } else if (score <= 4) {
      level = 'good';
    } else {
      level = 'strong';
    }

    const result = { level, score: Math.min(100, (score / 6) * 100), feedback };

    onStrengthChange?.(result);
    return result;
  }, [password, onStrengthChange]);

  const getColor = () => {
    switch (strength.level) {
      case 'weak':
        return 'bg-red-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'good':
        return 'bg-blue-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getTextColor = () => {
    switch (strength.level) {
      case 'weak':
        return 'text-red-600';
      case 'fair':
        return 'text-yellow-600';
      case 'good':
        return 'text-blue-600';
      case 'strong':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Password Strength
          </label>
          <span className={`text-sm font-semibold ${getTextColor()}`}>
            {strength.level.charAt(0).toUpperCase() + strength.level.slice(1)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getColor()} transition-all duration-300`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Suggestions:</p>
          <ul className="space-y-1">
            {strength.feedback.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-gray-600"
              >
                <X size={14} className="text-red-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements Met */}
      {strength.level !== 'weak' && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">Requirements met:</p>
          <ul className="space-y-1">
            {password.length >= 8 && (
              <li className="flex items-center gap-2 text-xs text-green-600">
                <Check size={14} className="flex-shrink-0" />
                At least 8 characters
              </li>
            )}
            {/[a-z]/.test(password) && (
              <li className="flex items-center gap-2 text-xs text-green-600">
                <Check size={14} className="flex-shrink-0" />
                Lowercase letters
              </li>
            )}
            {/[A-Z]/.test(password) && (
              <li className="flex items-center gap-2 text-xs text-green-600">
                <Check size={14} className="flex-shrink-0" />
                Uppercase letters
              </li>
            )}
            {/[0-9]/.test(password) && (
              <li className="flex items-center gap-2 text-xs text-green-600">
                <Check size={14} className="flex-shrink-0" />
                Numbers
              </li>
            )}
            {/[^a-zA-Z0-9]/.test(password) && (
              <li className="flex items-center gap-2 text-xs text-green-600">
                <Check size={14} className="flex-shrink-0" />
                Special characters
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
