"use client";

import React, { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { getAllEvents, getEventsByCategory } from "@/utils/eventService";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  ExternalLink,
  Tag,
} from "lucide-react";
import MainLayout from "@/components/Layouts/MainLayout";
import { useRouter } from "next/navigation";

type LayoutType = "grid" | "list";
type FilterType =
  | "all"
  | "conference"
  | "meetup"
  | "hackathon"
  | "workshop"
  | "x-space";
type TimeFilter = "all" | "upcoming" | "past";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FilterType>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Load events on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Apply filters when events or filters change
  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, categoryFilter, timeFilter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.details.toLowerCase().includes(query) ||
          event.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    // Apply time filter
    const now = new Date();
    if (timeFilter === "upcoming") {
      filtered = filtered.filter((event) => event.startDate > now);
    } else if (timeFilter === "past") {
      filtered = filtered.filter((event) => event.endDate < now);
    }

    setFilteredEvents(filtered);
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

  const isEventUpcoming = (event: Event) => {
    return event.startDate > new Date();
  };

  const isEventLive = (event: Event) => {
    const now = new Date();
    return event.startDate <= now && event.endDate >= now;
  };

  const getEventStatus = (event: Event) => {
    if (isEventLive(event)) return "live";
    if (isEventUpcoming(event)) return "upcoming";
    return "past";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500";
      case "upcoming":
        return "bg-blue-500";
      case "past":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live Now";
      case "upcoming":
        return "Upcoming";
      case "past":
        return "Past Event";
      default:
        return "Event";
    }
  };

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const status = getEventStatus(event);
    const router = useRouter();

    if (layout === "list") {
      return (
        <div
          className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push(`/events/${event.id}`)}
        >
          <div className="flex">
            {/* Event Banner */}
            {event.bannerUrl && (
              <div className="w-1/3 h-full">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Event Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-[#8E0EB9] text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                    {event.category}
                  </span>
                  <span
                    className={`inline-block text-white text-xs px-2 py-1 rounded-full ${getStatusColor(
                      status
                    )}`}
                  >
                    {getStatusText(status)}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {event.title}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{event.location.details}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {event.location.type === "virtual"
                      ? "Virtual"
                      : "In-Person"}
                  </span>
                </div>
                {event.stats?.map(
                  (stat, index) =>
                    stat.title.toLowerCase().includes("attendee") && (
                      <div key={index} className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {stat.value} {stat.title}
                        </span>
                      </div>
                    )
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description?.replace(/[#*`]/g, "") ||
                  "No description available"}
              </p>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 4).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {event.tags.length > 4 && (
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      +{event.tags.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Registration Button */}
              {isEventUpcoming(event) ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#8E0EB9] text-white px-4 py-2 rounded-full hover:bg-[#6B4AEF] transition-colors text-sm"
                >
                  Register Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : getEventStatus(event) === "past" && event.albumUrl ? (
                <a
                  href={event.albumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#8E0EB9] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 group"
                >
                  View Photos
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              ) : isEventLive(event) ? (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-all duration-300 group"
                >
                  Join Now
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold">
                  Event Ended
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Grid layout
    return (
      <div
        className=" rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => router.push(`/events/${event.id}`)}
      >
        {/* Event Banner */}
        {event.bannerUrl && (
          <div className="h-48 bg-gray-200 relative">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <span
                className={`inline-block text-white text-xs px-2 py-1 rounded-full ${getStatusColor(
                  status
                )}`}
              >
                {getStatusText(status)}
              </span>
            </div>
          </div>
        )}

        {/* Event Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <span className="inline-block bg-[#8E0EB9] text-white text-xs px-2 py-1 rounded-full uppercase tracking-wide">
              {event.category}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.location.details}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {event.location.type === "virtual" ? "Virtual" : "In-Person"}
              </span>
            </div>
            {event.stats?.map(
              (stat, index) =>
                stat.title.toLowerCase().includes("attendee") && (
                  <div key={index} className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {stat.value} {stat.title}
                    </span>
                  </div>
                )
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
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

          {/* Registration Button */}
          {isEventUpcoming(event) ? (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#8E0EB9] text-white px-4 py-2 rounded-full hover:bg-[#6B4AEF] transition-colors text-sm"
            >
              Register Now
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : getEventStatus(event) === "past" && event.albumUrl ? (
            <a
              href={event.albumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#8E0EB9] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 group"
            >
              View Photos
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          ) : isEventLive(event) ? (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-all duration-300 group"
            >
              Join Now
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 bg-gray-300 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold">
              Event Ended
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8E0EB9] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Discover Events
            </h1>
            <p className="text-gray-600 text-lg">
              Join amazing events and connect with the community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events by title, description, location, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E0EB9] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Layout Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-2 rounded-lg ${
                    layout === "grid"
                      ? "bg-[#8E0EB9] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-2 rounded-lg ${
                    layout === "list"
                      ? "bg-[#8E0EB9] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) =>
                        setCategoryFilter(e.target.value as FilterType)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E0EB9] focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="conference">Conference</option>
                      <option value="meetup">Meetup</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop</option>
                      <option value="x-space">X Space</option>
                    </select>
                  </div>

                  {/* Time Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <select
                      value={timeFilter}
                      onChange={(e) =>
                        setTimeFilter(e.target.value as TimeFilter)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8E0EB9] focus:border-transparent"
                    >
                      <option value="all">All Events</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past Events</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {filteredEvents.length} event
              {filteredEvents.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            {(searchQuery ||
              categoryFilter !== "all" ||
              timeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setTimeFilter("all");
                }}
                className="text-[#8E0EB9] hover:text-[#6B4AEF] text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Events Grid/List */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || categoryFilter !== "all" || timeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Check back later for upcoming events"}
              </p>
            </div>
          ) : (
            <div
              className={
                layout === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default EventsPage;
