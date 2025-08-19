import { Event } from '@/types/event';
import { X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import React, { useState, useEffect } from 'react';
import { createEvent, updateEvent } from '@/utils/eventService';
import { uploadImageToCloudinary, validateImageFile } from '@/utils/imageUpload';

import MDEditor, { commands } from '@uiw/react-md-editor';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (eventData: Partial<Event>) => Promise<void>;
  initialData?: Partial<Event>;
  mode?: 'create' | 'edit';
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<Partial<Event>>({
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
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        ...initialData,
        // Ensure location has default structure if not present
        location: initialData.location || { type: 'physical', details: '' },
        // Ensure tags is an array
        tags: initialData.tags || []
      });
      setBannerPreview(initialData.bannerUrl || null);
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        category: 'conference',
        description: '',
        location: { type: 'physical', details: '' },
        registrationLink: '',
        tags: []
      });
      setBannerPreview(null);
    }
    
    // Reset file and progress when modal opens/closes or mode changes
    setBannerFile(null);
    setUploadProgress(0);
  }, [initialData, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        throw new Error('Event title is required');
      }
      if (!formData.startDate) {
        throw new Error('Start date is required');
      }
      if (!formData.endDate) {
        throw new Error('End date is required');
      }
      if (!formData.location?.details?.trim()) {
        throw new Error('Location details are required');
      }
      if (!formData.registrationLink?.trim()) {
        throw new Error('Registration link is required');
      }

      // Validate dates
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        throw new Error('End date must be after start date');
      }

      let bannerUrl = formData.bannerUrl;
      
      // Upload banner image if a new file was selected
      if (bannerFile) {
        setUploadProgress(25);
        bannerUrl = await uploadImageToCloudinary(bannerFile, 'events/banners');
        setUploadProgress(50);
      }
      
      // Prepare event data
      const eventData = {
        ...formData,
        bannerUrl: bannerUrl || '',
        // Ensure dates are properly formatted
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        // Clean up tags (remove empty strings)
        tags: formData.tags?.filter(tag => tag.trim() !== '') || []
      };
      
      setUploadProgress(75);
      
      let eventId: string;
      
      if (mode === 'edit' && initialData?.id) {
        await updateEvent(initialData.id, eventData);
        eventId = initialData.id;
      } else {
        eventId = await createEvent(eventData as Omit<Event, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      setUploadProgress(100);
      
      // Call parent onSubmit if provided
      if (onSubmit) {
        await onSubmit({ ...eventData, id: eventId });
      }
      
      // Show success message
      alert(`Event ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      
      onClose();
      
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Failed to ${mode === 'edit' ? 'update' : 'create'} event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate the file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
      
      setBannerFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    if (!loading) {
      setBannerFile(null);
      setUploadProgress(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'edit' ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button onClick={handleClose} className="p-2" disabled={loading}>
              <X />
            </button>
          </div>

          {loading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#7B5CFF] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {uploadProgress < 50 ? 'Uploading image...' : 
                 uploadProgress < 75 ? 'Processing...' : 
                 uploadProgress < 100 ? `${mode === 'edit' ? 'Updating' : 'Creating'} event...` : 'Complete!'}
              </p>
            </div>
          )}

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
                disabled={loading}
              />
              {bannerPreview && (
                <div className="mt-2 relative">
                  <img
                    src={bannerPreview}
                    alt="Event Banner Preview"
                    className="w-full h-48 object-cover rounded border"
                  />
                  {bannerFile && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      New Image Selected
                    </div>
                  )}
                </div>
              )}
              {mode === 'edit' && !bannerPreview && (
                <p className="text-sm text-gray-500 mt-1">No banner image uploaded yet</p>
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
                onClick={handleClose}
                className="px-4 py-2 border border-[#7B5CFF] rounded-full"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#7B5CFF] text-white rounded-full disabled:opacity-50"
                disabled={loading}
              >
                {loading ? `${mode === 'edit' ? 'Updating' : 'Creating'}...` : (mode === 'edit' ? 'Update Event' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EventFormModal;
