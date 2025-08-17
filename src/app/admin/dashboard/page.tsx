"use client";

import DashboardLayout from "@/components/Layouts/DashboardLayout";
import { Event } from "@/types/event";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  doc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { Calendar, MapPin, Plus, Users, ImagePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import EventFormModal from "@/components/events/EventFormModal";
import EventStatsModal from "@/components/events/EventStatsModal";
import { app } from "@/utils/firebase";

const db = getFirestore(app);

const DashboardPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, orderBy("startDate", "desc"));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      const eventsRef = collection(db, "events");
      await addDoc(eventsRef, {
        ...eventData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  const handleUpdateEventStats = async (
    eventId: string,
    data: { stats: Event["stats"]; gallery: string[] }
  ) => {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        stats: data.stats,
        gallery: data.gallery,
        updatedAt: new Date(),
      });
      fetchEvents();
    } catch (error) {
      console.error("Error updating event stats:", error);
      throw error;
    }
  };

  const isEventPast = (event: Event) => {
    return new Date(event.endDate) < new Date();
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Events Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-full 
            bg-[#7B5CFF]"
          >
            <Plus size={20} />
            Create Event
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading events...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {event.bannerUrl && (
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="inline-block px-2 py-1 mb-2 text-sm bg-blue-100 text-blue-800 rounded">
                    {event.category}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        {new Date(event.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>
                        {event.location.type === "virtual"
                          ? "Virtual Event"
                          : event.location.details}
                      </span>
                    </div>
                    {event.stats?.attendees && (
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{event.stats.attendees} attendees</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {isEventPast(event) && (
                    <div className="mt-4 border-t pt-4">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsStatsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        <ImagePlus size={16} />
                        {event.stats
                          ? "Update Stats & Gallery"
                          : "Add Stats & Gallery"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <EventFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateEvent}
        />

        {selectedEvent && (
          <EventStatsModal
            isOpen={isStatsModalOpen}
            onClose={() => {
              setIsStatsModalOpen(false);
              setSelectedEvent(null);
            }}
            onSubmit={handleUpdateEventStats}
            event={selectedEvent}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
