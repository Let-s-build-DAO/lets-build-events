"use client";

import React, { useState, useEffect } from "react";
import EventFormModal from "@/components/events/EventFormModal";
import EventStatsModal from "@/components/events/EventStatsModal";
import { Event } from "@/types/event";
import { getAllEvents, deleteEvent, updateEventStats } from "@/utils/eventService";
import { Calendar, MapPin, Users, Edit, Trash2, Plus, BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/Layouts/DashboardLayout";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [statsEvent, setStatsEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleAddStats = (event: Event) => {
    setStatsEvent(event);
    setIsStatsModalOpen(true);
  };

  const handleStatsSubmit = async (eventId: string, data: { stats: Event['stats'], gallery: string[], albumUrl?: string }) => {
    try {
      await updateEventStats(eventId, data.stats, data.gallery, data.albumUrl);
      await loadEvents(); // Refresh the list
      alert("Event stats updated successfully!");
    } catch (error) {
      console.error("Error updating event stats:", error);
      alert("Failed to update event stats");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        await loadEvents(); // Refresh the list
        alert("Event deleted successfully");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleStatsModalClose = () => {
    setIsStatsModalOpen(false);
    setStatsEvent(null);
  };

  const handleEventSubmit = async () => {
    // Refresh events list after successful submit
    await loadEvents();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isEventPast = (event: Event) => {
    const now = new Date();
    return event.endDate ? event.endDate < now : event.startDate < now;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B5CFF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Events Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage your events
              </p>
            </div>
            <button
              onClick={handleCreateEvent}
              className="bg-[#7B5CFF] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#6B4AEF] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first event to get started
              </p>
              <button
                onClick={handleCreateEvent}
                className="bg-[#7B5CFF] text-white px-6 py-3 rounded-full hover:bg-[#6B4AEF] transition-colors"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Event Banner */}
                  {event.bannerUrl && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={event.bannerUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block bg-[#7B5CFF] text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                          {event.category}
                        </span>
                        {isEventPast(event) && (
                          <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                            Past Event
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-gray-600 hover:text-[#7B5CFF] transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {isEventPast(event) && (
                          <button
                            onClick={() => handleAddStats(event)}
                            className="text-gray-600 hover:text-green-600 transition-colors"
                            title="Add Event Stats"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-gray-600 hover:text-red-500 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">
                          {event.location.details}
                        </span>
                      </div>
                      {event.stats?.attendees && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.stats.attendees} attendees</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {event.tags.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{event.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Event Form Modal */}
          <EventFormModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleEventSubmit}
            initialData={editingEvent || undefined}
            mode={editingEvent ? "edit" : "create"}
          />

          {/* Event Stats Modal */}
          {statsEvent && (
            <EventStatsModal
              isOpen={isStatsModalOpen}
              onClose={handleStatsModalClose}
              onSubmit={handleStatsSubmit}
              event={statsEvent}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EventsPage;
