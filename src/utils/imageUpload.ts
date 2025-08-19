// Client-side utility for image uploads using the API route

export const uploadImageToCloudinary = async (file: File, folder: string = 'events'): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImageFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from Cloudinary URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (!publicId) {
      throw new Error('Invalid image URL');
    }

    const response = await fetch(`/api/upload?public_id=${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Helper function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Extract public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/cloud/image/upload/v123456/folder/image_id.jpg
    const regex = /\/v\d+\/(.+)\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?|$)/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

// Upload multiple images
export const uploadMultipleImagesToCloudinary = async (files: File[], folder: string = 'events/gallery'): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImageToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

// Validate image file
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file' };
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  return { isValid: true };
};

// Generate optimized Cloudinary URL
export const getOptimizedImageUrl = (
  imageUrl: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  } = {}
): string => {
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl; // Return original URL if not a Cloudinary URL
  }

  const { width = 800, height = 600, crop = 'fill', quality = 'auto:good' } = options;
  
  // Insert transformation parameters into the URL
  const transformationString = `w_${width},h_${height},c_${crop},q_${quality},f_auto`;
  const uploadIndex = imageUrl.indexOf('/upload/');
  
  if (uploadIndex !== -1) {
    return imageUrl.slice(0, uploadIndex + 8) + transformationString + '/' + imageUrl.slice(uploadIndex + 8);
  }
  
  return imageUrl;
};
