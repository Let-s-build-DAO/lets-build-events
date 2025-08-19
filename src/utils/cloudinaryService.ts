import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
export const uploadToCloudinary = async (file: File, folder: string = 'events'): Promise<string> => {
  try {
    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 630, crop: 'limit', quality: 'auto:good' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleToCloudinary = async (files: File[], folder: string = 'events/gallery'): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw new Error('Failed to upload images to Cloudinary');
  }
};

// Helper function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const regex = /\/([^\/]+)\.(jpg|jpeg|png|gif|webp)$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

// Get optimized image URL with transformations
export const getOptimizedImageUrl = (
  publicId: string, 
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  } = {}
): string => {
  const { width = 800, height = 600, crop = 'fill', quality = 'auto:good' } = options;
  
  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    format: 'auto'
  });
};

export default cloudinary;
