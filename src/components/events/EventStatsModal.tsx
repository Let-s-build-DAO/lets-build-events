import { Event } from "@/types/event";
import { X, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  uploadMultipleImagesToCloudinary,
  validateImageFile,
} from "@/utils/imageUpload";
import Modal from "@/components/ui/Modal";

interface DynamicStat {
  title: string;
  value: string;
}

interface EventStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    eventId: string,
    data: { stats: DynamicStat[]; gallery: string[]; albumUrl?: string }
  ) => Promise<void>;
  event: Event;
}

const EventStatsModal: React.FC<EventStatsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  event,
}) => {
  const [stats, setStats] = useState<DynamicStat[]>(
    event.stats
      ? Object.entries(event.stats).map(([key, value]) => ({
          title: key,
          value: value.toString(),
        }))
      : []
  );
  const [imageUrls, setImageUrls] = useState<string[]>(event.gallery || []);
  const [albumUrl, setAlbumUrl] = useState(event.albumUrl || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filter out empty stats
      const filteredStats = stats.filter(
        (stat) => stat.title.trim() && stat.value.trim()
      );

      await onSubmit(event.id, {
        stats: filteredStats,
        gallery: imageUrls,
        albumUrl: albumUrl.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error updating event stats:", error);
      alert("Failed to update event stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addStat = () => {
    setStats([...stats, { title: "", value: "" }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (
    index: number,
    field: keyof DynamicStat,
    value: string
  ) => {
    setStats(
      stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat))
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Validate files
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(`${file.name}: ${validation.error}`);
        return;
      }
    }

    if (fileArray.length > 10) {
      alert("You can upload a maximum of 10 images at once");
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls = await uploadMultipleImagesToCloudinary(
        fileArray,
        "events/gallery"
      );
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload some images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateImageUrl = (
    url: string
  ): { isValid: boolean; error?: string } => {
    if (!url.trim()) {
      return { isValid: false, error: "URL cannot be empty" };
    }

    try {
      new URL(url);
    } catch {
      return { isValid: false, error: "Please enter a valid URL" };
    }

    // Check for Google Photos/Drive URLs
    if (
      url.includes("photos.google.com") ||
      url.includes("photos.app.goo.gl")
    ) {
      return {
        isValid: false,
        error:
          "Google Photos URLs cannot be displayed. Please upload the image file instead or use a direct image URL.",
      };
    }

    if (url.includes("drive.google.com")) {
      return {
        isValid: false,
        error:
          "Google Drive URLs cannot be displayed directly. Please upload the image file instead or use a direct image URL (imgur.com, etc.).",
      };
    }

    return { isValid: true };
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add Event Stats & Gallery</h2>
            <button onClick={onClose} className="p-2" disabled={loading}>
              <X />
            </button>
          </div>

          {uploading && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#8E0EB9] h-2 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Uploading images...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Event Statistics</h3>
                <button
                  type="button"
                  onClick={addStat}
                  className="flex items-center gap-1 text-[#8E0EB9] text-sm"
                >
                  <Plus size={16} />
                  Add Stat
                </button>
              </div>

              {stats.map((stat, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Statistic title (e.g., Number of Attendees)"
                      value={stat.title}
                      onChange={(e) =>
                        updateStat(index, "title", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., 150, 85%, Great feedback)"
                      value={stat.value}
                      onChange={(e) =>
                        updateStat(index, "value", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {stats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="text-red-600 hover:text-red-700 mt-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Photo Gallery</h3>

              {/* Album URL Section */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Album URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://photos.google.com/share/... or https://drive.google.com/..."
                  value={albumUrl}
                  onChange={(e) => setAlbumUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Link to the complete photo album (Google Photos, Google Drive,
                  Flickr, etc.) for users to view all photos
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Add Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Direct image URL (imgur.com, cloudinary.com, etc.)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const validation = validateImageUrl(newImageUrl);
                        if (!validation.isValid) {
                          alert(validation.error);
                          return;
                        }
                        setImageUrls([...imageUrls, newImageUrl.trim()]);
                        setNewImageUrl("");
                      }}
                      className="px-4 py-2 bg-[#8E0EB9] text-white rounded"
                      disabled={!newImageUrl.trim()}
                    >
                      Add
                    </button>
                  </div>

                  {/* Helper text */}
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="mb-1">
                      <strong>✅ Supported:</strong> Direct image URLs ending in
                      .jpg, .png, .gif, etc.
                    </p>
                    <p className="mb-1">
                      <strong>✅ Recommended:</strong> Upload files above or use
                      imgur.com, cloudinary.com
                    </p>
                    <p>
                      <strong>❌ Not supported:</strong> Google Drive, Google
                      Photos, or other share links
                    </p>
                  </div>
                </div>
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
                className="px-4 py-2 border border-[#8E0EB9] rounded-full"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8E0EB9] text-white rounded-full disabled:opacity-50"
                disabled={loading || uploading}
              >
                {loading ? "Saving..." : "Save Stats & Gallery"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EventStatsModal;
