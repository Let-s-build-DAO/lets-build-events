"use client";

import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Zap,
  ArrowRight,
  Clock,
  ExternalLink,
  Sparkles,
  Globe,
  Mic,
  Code2,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getAllEvents } from "@/utils/eventService";
import { Event } from "@/types/event";
import MainLayout from "@/components/Layouts/MainLayout";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await getAllEvents();
        setAllEvents(events);
        // Get 3 most recent created events (regardless of start date)
        const recent = events
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);
        setRecentEvents(recent);

        // Calculate stats - keep upcoming events count for stats
        const upcoming = events.filter(
          (event) => new Date(event.startDate) > new Date()
        );
        const totalAttendees = events.reduce((sum, event) => {
          if (event.stats && Array.isArray(event.stats)) {
            const attendeesStat = event.stats.find(
              (stat: { title: string; value: string } | any) =>
                stat.title && stat.title.toLowerCase().includes("attendees")
            ) as { title: string; value: string } | undefined;
            return sum + (attendeesStat ? Number(attendeesStat.value) || 0 : 0);
          }
          return sum;
        }, 0);
        setStats({
          totalEvents: events.length,
          totalAttendees,
          upcomingEvents: upcoming.length,
        });
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return "";
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const eventCategories = [
    {
      name: "Conferences",
      description:
        "Large-scale events with industry leaders and keynote speakers",
      icon: Mic,
      color: "bg-purple-500",
      count: allEvents.filter(
        (e) => e.category === "conference" && new Date(e.startDate) > new Date()
      ).length,
    },
    {
      name: "Meetups",
      description: "Casual networking events and community gatherings",
      icon: Users,
      color: "bg-blue-500",
      count: allEvents.filter(
        (e) => e.category === "meetup" && new Date(e.startDate) > new Date()
      ).length,
    },
    {
      name: "Hackathons",
      description: "Competitive coding events and innovation challenges",
      icon: Code2,
      color: "bg-green-500",
      count: allEvents.filter(
        (e) => e.category === "hackathon" && new Date(e.startDate) > new Date()
      ).length,
    },
    {
      name: "Workshops",
      description: "Hands-on learning experiences and skill development",
      icon: Zap,
      color: "bg-orange-500",
      count: allEvents.filter(
        (e) => e.category === "workshop" && new Date(e.startDate) > new Date()
      ).length,
    },
    {
      name: "X-Spaces",
      description: "Twitter Spaces and virtual audio conversations",
      icon: Globe,
      color: "bg-indigo-500",
      count: allEvents.filter(
        (e) => e.category === "x-space" && new Date(e.startDate) > new Date()
      ).length,
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7B5CFF]/5 to-blue-600/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#8E0EB9]/10 text-[#8E0EB9] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Welcome to LBD Events
              </div>

              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Connect, Learn, and
                <span className="block text-[#8E0EB9]">Build Together</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Join the LBD community and discover amazing events that inspire
                innovation, foster learning, and connect builders from around
                the world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 bg-[#8E0EB9] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#7D0CA7] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explore Events
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#community"
                  className="inline-flex items-center gap-2 border-2 border-[#8E0EB9] text-[#8E0EB9] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8E0EB9] hover:text-white transition-all duration-300"
                >
                  <UserPlus className="w-5 h-5" />
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8E0EB9] rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {loading ? "..." : stats.totalEvents}+
                </h3>
                <p className="text-gray-600">Total Events Hosted</p>
              </div>
              <div className="group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {loading ? "..." : stats.totalAttendees.toLocaleString()}+
                </h3>
                <p className="text-gray-600">Events Attendees</p>
              </div>
              <div className="group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {loading ? "..." : stats.upcomingEvents}+
                </h3>
                <p className="text-gray-600">Upcoming Events</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Events */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Recent Events
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Check out the latest events from our community
              </p>
            </div>

            {recentEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {recentEvents.map((event) => {
                    const isUpcoming = new Date(event.startDate) > new Date();
                    const isPast = new Date(event.endDate) < new Date();
                    const isLive = !isUpcoming && !isPast;

                    return (
                      <div
                        key={event.id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
                      >
                        {event.bannerUrl && (
                          <div
                            onClick={() => router.push(`/events/${event.id}`)}
                            className="h-48 bg-gray-200 relative overflow-hidden"
                          >
                            <img
                              src={event.bannerUrl}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                              <span className="bg-[#8E0EB9] text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                                {event.category.replace("-", " ")}
                              </span>
                              {isLive && (
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  Live
                                </span>
                              )}
                              {isPast && (
                                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  Past
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                            {event.title}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">
                                {formatDate(event.startDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm truncate">
                                {event.location.details}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">
                                {event.location.type === "virtual"
                                  ? "Virtual"
                                  : "In-Person"}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {event.description?.replace(/[#*`]/g, "") ||
                              "No description available"}
                          </p>

                          {isUpcoming ? (
                            <a
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-[#8E0EB9] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#7D0CA7] transition-all duration-300 group"
                            >
                              Register Now
                              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                          ) : isPast && event.albumUrl ? (
                            <a
                              href={event.albumUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-[#8E0EB9] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 group"
                            >
                              View Photos
                              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                          ) : isLive ? (
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
                  })}
                </div>

                <div className="text-center">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 border-2 border-[#8E0EB9] text-[#8E0EB9] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#8E0EB9] hover:text-white transition-all duration-300"
                  >
                    View All Events
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No events yet
                </h3>
                <p className="text-gray-500">
                  Check back soon for exciting new events!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Event Categories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Event Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover different types of events tailored to your interests
                and expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 ${category.color} rounded-xl text-white`}
                    >
                      <category.icon className="w-6 h-6" />
                    </div>
                    {category.count > 0 && (
                      <span className="bg-[#8E0EB9] text-white text-xs px-2 py-1 rounded-full">
                        {category.count} upcoming
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              ))}

              {/* Add more categories placeholder */}
              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-gray-100 border-dashed">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-300 rounded-xl text-gray-500 mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    More Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    We're always adding new event types based on community needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community CTA Section */}
        <section
          id="community"
          className="py-20 bg-[#8E0EB9] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8E0EB9] to-[#7D0CA7]"></div>
          <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <UserPlus className="w-4 h-4" />
              Join the Community
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Something Amazing?
            </h2>

            <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
              Join thousands of builders, creators, and innovators in the LBD
              community. Discover events, share knowledge, and collaborate on
              the future of technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="inline-flex items-center justify-evenly gap-2 bg-white text-[#8E0EB9] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Explore All Events</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-evenly gap-2 border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#8E0EB9] transition-all duration-300"
              >
                Join Our Community
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/80">
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Global Community</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Expert Networks</p>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Innovation Focused</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
