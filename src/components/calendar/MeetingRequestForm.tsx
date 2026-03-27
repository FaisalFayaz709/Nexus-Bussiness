import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send, X } from 'lucide-react';

interface MeetingRequestFormProps {
  recipientName: string;
  onSubmit: (data: {
    message: string;
    proposedStartTime: string;
    proposedEndTime: string;
  }) => void;
  onCancel: () => void;
}

export const MeetingRequestForm: React.FC<MeetingRequestFormProps> = ({
  recipientName,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    proposedDate: '',
    proposedStartTime: '10:00',
    proposedEndTime: '11:00',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.proposedDate) {
      newErrors.proposedDate = 'Date is required';
    }

    if (!formData.proposedStartTime) {
      newErrors.proposedStartTime = 'Start time is required';
    }

    if (!formData.proposedEndTime) {
      newErrors.proposedEndTime = 'End time is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (formData.proposedStartTime && formData.proposedEndTime) {
      const [startHour, startMin] = formData.proposedStartTime.split(':').map(Number);
      const [endHour, endMin] = formData.proposedEndTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (startMinutes >= endMinutes) {
        newErrors.proposedEndTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const startDateTime = new Date(`${formData.proposedDate}T${formData.proposedStartTime}`);
      const endDateTime = new Date(`${formData.proposedDate}T${formData.proposedEndTime}`);

      onSubmit({
        message: formData.message,
        proposedStartTime: startDateTime.toISOString(),
        proposedEndTime: endDateTime.toISOString(),
      });
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Request Meeting with {recipientName}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Propose a time that works for you
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proposed Date
          </label>
          <Input
            type="date"
            value={formData.proposedDate}
            onChange={(e) =>
              setFormData({ ...formData, proposedDate: e.target.value })
            }
            min={minDate}
            className={errors.proposedDate ? 'border-red-500' : ''}
          />
          {errors.proposedDate && (
            <p className="text-red-500 text-xs mt-1">{errors.proposedDate}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <Input
              type="time"
              value={formData.proposedStartTime}
              onChange={(e) =>
                setFormData({ ...formData, proposedStartTime: e.target.value })
              }
              className={errors.proposedStartTime ? 'border-red-500' : ''}
            />
            {errors.proposedStartTime && (
              <p className="text-red-500 text-xs mt-1">{errors.proposedStartTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <Input
              type="time"
              value={formData.proposedEndTime}
              onChange={(e) =>
                setFormData({ ...formData, proposedEndTime: e.target.value })
              }
              className={errors.proposedEndTime ? 'border-red-500' : ''}
            />
            {errors.proposedEndTime && (
              <p className="text-red-500 text-xs mt-1">{errors.proposedEndTime}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Tell them why you want to meet..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Send Request
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 flex items-center justify-center gap-2"
          >
            <X size={18} />
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
