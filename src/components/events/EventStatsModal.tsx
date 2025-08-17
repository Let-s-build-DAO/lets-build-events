import { Event } from '@/types/event';
import { X } from 'lucide-react';
import React, { useState } from 'react';

interface EventStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventId: string, data: { stats: Event['stats'], gallery: string[] }) => Promise<void>;
  event: Event;
}

const EventStatsModal: React.FC<EventStatsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  event
}) => {
  const [formData, setFormData] = useState({
    stats: {
      attendees: event.stats?.attendees || 0,
      engagement: event.stats?.engagement || 0,
      feedback: event.stats?.feedback || ''
    },
    gallery: event.gallery || []
  });
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(event.gallery || []);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(event.id, {
        stats: formData.stats,
        gallery: imageUrls
      });
      onClose();
    } catch (error) {
      console.error('Error updating event stats:', error);
      alert('Failed to update event stats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      // TODO: Implement multiple image upload to storage
      // const uploadedUrls = await Promise.all(
      //   Array.from(files).map(file => uploadImage(file))
      // );
      // setImageUrls(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add Event Stats & Gallery</h2>
            <button onClick={onClose} className="p-2">
              <X />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Event Statistics</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Number of Attendees</label>
                <input
                  type="number"
                  value={formData.stats.attendees}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, attendees: parseInt(e.target.value) }
                  }))}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Engagement Rate (%)</label>
                <input
                  type="number"
                  value={formData.stats.engagement}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, engagement: parseInt(e.target.value) }
                  }))}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Feedback</label>
                <textarea
                  value={formData.stats.feedback}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, feedback: e.target.value }
                  }))}
                  className="w-full p-2 border rounded h-32"
                  placeholder="Summary of attendee feedback..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photo Gallery</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Upload Photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded"
                  disabled={uploading}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading || uploading}
              >
                {loading ? 'Saving...' : 'Save Stats & Gallery'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventStatsModal;
