import { Event } from '@/types/event';
import { X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import React, { useState } from 'react';

import MDEditor, { commands } from '@uiw/react-md-editor';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: Partial<Event>) => Promise<void>;
  initialData?: Partial<Event>;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<Event>>(initialData || {
    title: '',
    category: 'conference',
    description: '',
    location: {
      type: 'physical',
      details: ''
    },
    registrationLink: '',
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(initialData?.bannerUrl || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // TODO: Implement image upload to storage
      // const url = await uploadImage(file);
      // setFormData(prev => ({ ...prev, bannerUrl: url }));
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {initialData ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button onClick={onClose} className="p-2">
              <X />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Event Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded"
              />
              {bannerPreview && (
                <div className="mt-2">
                  <img
                    src={bannerPreview}
                    alt="Event Banner Preview"
                    className="w-full h-48 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Event['category'] }))}
                className="w-full p-2 border rounded"
                required
              >
                <option value="conference">Conference</option>
                <option value="meetup">Meetup</option>
                <option value="hackathon">Hackathon</option>
                <option value="workshop">Workshop</option>
                <option value="x-space">X Space</option>
              </select>
            </div>

            {/* Description (Markdown Editor) */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.description || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value || '' }))}
                  height={200}
                  visiableDragbar={false}
                  commands={[ 
                    commands.bold,
                    commands.italic,
                    commands.strikethrough,
                    commands.unorderedListCommand,
                    commands.orderedListCommand,
                    commands.link,
                    commands.quote,
                    commands.code,
                  ]}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location Type</label>
                <select
                  value={formData.location?.type || 'physical'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: {
                      type: e.target.value as 'physical' | 'virtual',
                      details: prev.location?.details ?? ''
                    }
                  }))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="physical">Physical</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location Details</label>
                <input
                  type="text"
                  value={formData.location?.details || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: {
                      details: e.target.value,
                      type: prev.location?.type ? prev.location.type : 'physical'
                    }
                  }))}
                  className="w-full p-2 border rounded"
                  placeholder={formData.location?.type === 'virtual' ? 'Meeting link' : 'Address'}
                  required
                />
              </div>
            </div>

            {/* Registration Link */}
            <div>
              <label className="block text-sm font-medium mb-2">Registration Link</label>
              <input
                type="url"
                value={formData.registrationLink || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationLink: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(tag => tag.trim())
                }))}
                className="w-full p-2 border rounded"
                placeholder="web3, dao, community..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#7B5CFF] rounded-full"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#7B5CFF] text-white rounded-full"
                disabled={loading}
              >
                {loading ? 'Saving...' : (initialData ? 'Update Event' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EventFormModal;
