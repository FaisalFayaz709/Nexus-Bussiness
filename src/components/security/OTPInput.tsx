import React, { useRef, useEffect, useState } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  value = '',
  onChange,
}) => {
  const [otp, setOtp] = useState<string[]>(
    value ? value.split('').slice(0, length) : Array(length).fill('')
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

  useEffect(() => {
    if (value) {
      const newOtp = value.split('').slice(0, length);
      setOtp(newOtp.concat(Array(length - newOtp.length).fill('')));
    }
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    // Only allow digits
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChange?.(otpString);

    // Move to next field if digit is entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all fields are filled
    if (otpString.length === length) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange?.(newOtp.join(''));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    const newOtp = pastedData.split('').slice(0, length);

    while (newOtp.length < length) {
      newOtp.push('');
    }

    setOtp(newOtp);
    const otpString = newOtp.join('');
    onChange?.(otpString);

    if (newOtp.filter((val) => val).length === length) {
      onComplete(otpString);
    }

    // Focus on the last filled input
    const lastFilledIndex = newOtp.findIndex((val) => !val);
    if (lastFilledIndex !== -1) {
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <input
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
    </div>
  );
};
