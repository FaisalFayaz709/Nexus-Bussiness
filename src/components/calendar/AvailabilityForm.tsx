import React, { useState } from 'react';
import { AvailabilitySlot } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Clock, Save, X } from 'lucide-react';

interface AvailabilityFormProps {
  onSubmit: (slot: Partial<AvailabilitySlot>) => void;
  onCancel: () => void;
  initialSlot?: AvailabilitySlot;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  onSubmit,
  onCancel,
  initialSlot,
}) => {
  const [formData, setFormData] = useState({
    dayOfWeek: initialSlot?.dayOfWeek ?? 1,
    startTime: initialSlot?.startTime ?? '09:00',
    endTime: initialSlot?.endTime ?? '10:00',
    isRecurring: initialSlot?.isRecurring ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime) {
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (startMinutes >= endMinutes) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        dayOfWeek: parseInt(formData.dayOfWeek.toString()),
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-primary-600" />
        {initialSlot ? 'Edit Availability' : 'Add Availability Slot'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day of Week
          </label>
          <select
            value={formData.dayOfWeek}
            onChange={(e) =>
              setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {dayNames.map((day, index) => (
              <option key={index} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className={errors.startTime ? 'border-red-500' : ''}
            />
            {errors.startTime && (
              <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className={errors.endTime ? 'border-red-500' : ''}
            />
            {errors.endTime && (
              <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-md p-3">
          <input
            type="checkbox"
            id="recurring"
            checked={formData.isRecurring}
            onChange={(e) =>
              setFormData({ ...formData, isRecurring: e.target.checked })
            }
            className="w-4 h-4 rounded border-gray-300"
          />
          <label htmlFor="recurring" className="text-sm text-gray-700">
            Repeat every week on {dayNames[formData.dayOfWeek]}
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {initialSlot ? 'Update Slot' : 'Add Slot'}
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
