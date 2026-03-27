import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AvailabilityForm } from '../../components/calendar/AvailabilityForm';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AvailabilitySlot } from '../../types';
import { availabilitySlots } from '../../data/availabilitySlots';
import { Clock, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AvailabilityPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<AvailabilitySlot[]>(
    availabilitySlots.filter((s) => s.userId === user?.id)
  );
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  const handleAddSlot = (formData: Partial<AvailabilitySlot>) => {
    if (editingSlot) {
      // Update existing slot
      setSlots(
        slots.map((s) =>
          s.id === editingSlot.id
            ? {
                ...s,
                ...formData,
                id: s.id,
                userId: user?.id || '',
                createdAt: s.createdAt,
              }
            : s
        )
      );
      toast.success('Availability slot updated!');
      setEditingSlot(null);
    } else {
      // Add new slot
      const newSlot: AvailabilitySlot = {
        id: `avail_${Date.now()}`,
        userId: user?.id || '',
        startTime: formData.startTime || '09:00',
        endTime: formData.endTime || '10:00',
        dayOfWeek: formData.dayOfWeek || 1,
        isRecurring: formData.isRecurring ?? true,
        createdAt: new Date().toISOString(),
      };
      setSlots([...slots, newSlot]);
      toast.success('Availability slot added!');
    }
    setShowForm(false);
  };

  const handleDeleteSlot = (slotId: string) => {
    setSlots(slots.filter((s) => s.id !== slotId));
    toast.success('Availability slot deleted!');
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlot(null);
  };

  // Group slots by day of week
  const slotsByDay = dayNames.map((day, index) => ({
    day,
    dayIndex: index,
    slots: slots.filter((s) => s.dayOfWeek === index),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
            <p className="text-gray-600 mt-2">
              Set your available meeting times for others to find
            </p>
          </div>
          <Button
            onClick={() => navigate('/calendar')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            {showForm ? (
              <AvailabilityForm
                onSubmit={handleAddSlot}
                onCancel={handleCancel}
                initialSlot={editingSlot || undefined}
              />
            ) : (
              <Card className="p-6">
                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center gap-2"
                >
                  <Clock size={18} />
                  Add Time Slot
                </Button>
              </Card>
            )}
          </div>

          {/* Availability List */}
          <div className="lg:col-span-2">
            {slots.length === 0 && !showForm ? (
              <Card className="p-12 text-center">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No availability slots yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Add your available times so others can schedule meetings with you
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Add Your First Slot
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {slotsByDay.map(({ day, slots: daySlots }) => (
                  <div key={day}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {day}
                    </h3>
                    {daySlots.length === 0 ? (
                      <Card className="p-4 text-center text-gray-500">
                        No availability set for {day}
                      </Card>
                    ) : (
                      <div className="space-y-2">
                        {daySlots.map((slot) => (
                          <Card
                            key={slot.id}
                            className="p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock size={18} className="text-primary-600" />
                                <p className="font-medium text-gray-900">
                                  {slot.startTime} - {slot.endTime}
                                </p>
                              </div>
                              {slot.isRecurring && (
                                <p className="text-sm text-gray-600">
                                  Repeats every {day}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditSlot(slot)}
                                className="p-2 hover:bg-gray-100"
                              >
                                <Edit size={18} className="text-primary-600" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="p-2 hover:bg-gray-100"
                              >
                                <Trash2 size={18} className="text-red-600" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12">
          <Card className="p-6 bg-primary-50 border border-primary-200">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Tips for availability</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Set recurring slots for times you're regularly available</li>
              <li>• Include multiple options across different days</li>
              <li>• Update your availability as your schedule changes</li>
              <li>• Others can see your availability when requesting meetings</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
