import { db } from './firebase.js';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { Event } from '@/types/event';

// Collection reference
const eventsCollection = collection(db, 'events');

// Upload image to Cloudinary
export const uploadEventImage = async (file: File, folder: string = 'events'): Promise<string> => {
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
    throw new Error('Failed to upload image');
  }
};

// Create a new event
export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date();
    const eventToCreate = {
      ...eventData,
      startDate: Timestamp.fromDate(new Date(eventData.startDate)),
      endDate: Timestamp.fromDate(new Date(eventData.endDate)),
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now)
    };

    const docRef = await addDoc(eventsCollection, eventToCreate);
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
};

// Update an existing event
export const updateEvent = async (eventId: string, eventData: Partial<Event>): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const updateData = {
      ...eventData,
      updatedAt: Timestamp.fromDate(new Date())
    };

    // Convert dates to Timestamp if they exist
    if (eventData.startDate) {
      updateData.startDate = Timestamp.fromDate(new Date(eventData.startDate));
    }
    if (eventData.endDate) {
      updateData.endDate = Timestamp.fromDate(new Date(eventData.endDate));
    }

    await updateDoc(eventRef, updateData);
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
};

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const q = query(eventsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Event;
    });
  } catch (error) {
    console.error('Error getting events:', error);
    throw new Error('Failed to fetch events');
  }
};

// Get events by category
export const getEventsByCategory = async (category: Event['category']): Promise<Event[]> => {
  try {
    const q = query(
      eventsCollection, 
      where('category', '==', category), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Event;
    });
  } catch (error) {
    console.error('Error getting events by category:', error);
    throw new Error('Failed to fetch events by category');
  }
};

// Get a single event by ID
export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      const data = eventSnap.data();
      return {
        id: eventSnap.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Event;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting event:', error);
    throw new Error('Failed to fetch event');
  }
};

// Delete an event
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};

// Delete image from Cloudinary
export const deleteEventImage = async (imageUrl: string): Promise<void> => {
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
    throw new Error('Failed to delete image');
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

// Update event stats and gallery
export const updateEventStats = async (
  eventId: string, 
  stats: Event['stats'], 
  gallery: string[], 
  albumUrl?: string
): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const updateData: Partial<Event> = {
      stats,
      gallery,
      updatedAt: new Date()
    };
    
    if (albumUrl !== undefined) {
      updateData.albumUrl = albumUrl || undefined;
    }
    
    await updateDoc(eventRef, updateData);
  } catch (error) {
    console.error('Error updating event stats:', error);
    throw new Error('Failed to update event stats');
  }
};
