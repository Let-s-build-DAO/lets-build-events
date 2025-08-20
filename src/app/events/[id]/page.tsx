"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { Event } from "@/types/event";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { FaMap } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

// Dummy data for testing
const getDummyEvent = (id: string): Event => ({
  id: id,
  title: `Tech Conference ${id}`,
  bannerUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
  category: "conference",
  description: `This is a detailed description for the Tech Conference ${id}. Join us for an exciting day of technology discussions, workshops, and networking opportunities with industry leaders. The event will cover the latest trends in web development, cloud computing, and artificial intelligence.`,
  startDate:
    id === "1" ? new Date(2024, 5, 15, 9, 0) : new Date(2023, 10, 15, 9, 0),
  endDate:
    id === "1" ? new Date(2024, 5, 15, 17, 0) : new Date(2023, 10, 15, 17, 0),
  location: {
    type: "physical",
    details: "Convention Center, Port Harcourt",
  },
  registrationLink: "#register",
  gallery: [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72",
  ],
  albumUrl: "https://photos.app.goo.gl/example",
  stats: {
    attendees: 150,
    engagement: 85,
    feedback: "Excellent event with great speakers!",
  },
  tags: ["Technology", "Conference", "Networking"],
  createdAt: new Date(),
  updatedAt: new Date(),
  speakers: [
    {
      name: "Jane Smith",
      title: "CTO at TechCorp",
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "John Doe",
      title: "Lead Developer at InnovateCo",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ],
  agenda: [
    {
      time: "09:00 - 10:00",
      title: "Registration & Breakfast",
      description: "",
    },
    {
      time: "10:00 - 10:30",
      title: "Opening Keynote",
      description: "The future of web technologies",
    },
    {
      time: "10:30 - 12:00",
      title: "Workshop Sessions",
      description: "Choose between React, Angular or Vue deep dives",
    },
    { time: "12:00 - 13:30", title: "Lunch & Networking", description: "" },
    {
      time: "13:30 - 15:00",
      title: "Panel Discussion",
      description: "Industry leaders discuss emerging trends",
    },
  ],
});

// Helper function to format date and time
const formatEventDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatEventTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const EventPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        // We'll uncomment this when we want to actually connect it to the real firebase
        // if (id) {
        //   const eventData = await getEventById(id as string);
        //   if (eventData) {
        //     setEvent(eventData);
        //   } else {
        //     setError('Event not found');
        //   }
        // }

        if (id) setEvent(getDummyEvent(id as string));
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const isUpcoming = event ? new Date(event.endDate) > new Date() : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link href="/events" className="text-blue-600 hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-black text-xl mb-4">Event not found</p>
          <Link href="/events" className="text-blue-600 hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{event.title} | Your Company Name</title>
        <meta
          name="description"
          content={event.description.substring(0, 160)}
        />
        <meta property="og:title" content={event.title} />
        <meta
          property="og:description"
          content={event.description.substring(0, 160)}
        />
        <meta property="og:image" content={event.bannerUrl} />
      </Head>

      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 pt-6">
          <Link
            href="/events"
            className="flex items-center text-purple-800 hover:text-purple-600 transition-colors"
          >
            <HiArrowLeft className="w-5 h-5 mr-1" />
            Back to Events
          </Link>
        </div>

        <div className="relative h-[30rem] w-full overflow-hidden mt-4">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <span className="inline-block bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-2">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <p className="flex items-center text-white">
                  <IoLocationSharp className="w-5 h-5 mr-2" />
                  {event.location.details}
                </p>
                <p className="flex items-center text-white">
                  <FaCalendarAlt className="w-5 h-5 mr-2" />
                  {formatEventDate(new Date(event.startDate))} at{" "}
                  {formatEventTime(new Date(event.startDate))}
                </p>
              </div>
              {isUpcoming && event.registrationLink && (
                <a
                  href={event.registrationLink}
                  className="inline-block bg-white text-purple-800 hover:bg-purple-50 font-bold py-3 px-6 rounded-lg text-center transition-colors duration-200"
                >
                  Register Now
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 pb-2 text-purple-900 border-b border-purple-100">
                  About the Event
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {event.description}
                </p>

                {!isUpcoming && event.stats && (
                  <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-purple-900">
                      Event Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-3xl font-bold text-purple-800">
                          {event.stats.attendees}
                        </p>
                        <p className="text-gray-600">Attendees</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-3xl font-bold text-purple-800">
                          {event.stats.engagement}%
                        </p>
                        <p className="text-gray-600">Engagement</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-lg font-bold text-purple-800">
                          {event.stats.feedback}
                        </p>
                        <p className="text-gray-600">Feedback</p>
                      </div>
                    </div>
                  </div>
                )}

                {(event as any).agenda && (event as any).agenda.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-purple-900">
                      Event Agenda
                    </h3>
                    <div className="space-y-4">
                      {(event as any).agenda.map((item: any, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-purple-50 text-purple-900 font-medium rounded-lg py-1 px-3 mr-4 min-w-[100px] text-center border border-purple-100">
                            {item.time}
                          </div>
                          <div>
                            <h4 className="font-medium text-purple-900">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-gray-700 text-sm">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speakers Section */}
                {(event as any).speakers &&
                  (event as any).speakers.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-6 text-purple-900">
                        Featured Speakers
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(event as any).speakers.map(
                          (speaker: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-100"
                            >
                              <img
                                src={
                                  speaker.imageUrl ||
                                  "https://via.placeholder.com/80"
                                }
                                alt={speaker.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
                              />
                              <div>
                                <h4 className="font-bold text-lg text-purple-900">
                                  {speaker.name}
                                </h4>
                                <p className="text-purple-800 mb-2">
                                  {speaker.title}
                                </p>
                                {speaker.bio && (
                                  <p className="text-gray-700 text-sm">
                                    {speaker.bio}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Gallery Section */}
                {event.gallery && event.gallery.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-purple-900">
                      Event Gallery
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.gallery.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                        >
                          <img
                            src={imageUrl}
                            alt={`Event gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    {event.albumUrl && (
                      <div className="mt-4 text-center">
                        <a
                          href={event.albumUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-800 hover:text-purple-600"
                        >
                          View full photo album
                          <FiExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-purple-50 rounded-lg shadow-md p-6 sticky top-4 border border-purple-100">
                <h3 className="text-xl font-bold mb-4 text-purple-900">
                  Event Details
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Date & Time
                    </h4>
                    <p className="text-gray-700">
                      {formatEventDate(new Date(event.startDate))}
                      <br />
                      {formatEventTime(new Date(event.startDate))} -{" "}
                      {formatEventTime(new Date(event.endDate))}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      Location
                    </h4>
                    <p className="text-gray-700">{event.location.details}</p>
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      {event.location.type} event
                    </p>
                    {event.location.type === "physical" && (
                      <button className="text-purple-800 hover:text-purple-600 mt-1 text-sm flex items-center">
                        <FaMap className="w-4 h-4 mr-1" />
                        View on map
                      </button>
                    )}
                  </div>

                  {isUpcoming && (
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-1">
                        Registration
                      </h4>
                      <p className="text-gray-700">Spots available: 42</p>
                    </div>
                  )}
                </div>

                {isUpcoming ? (
                  <a
                    href={event.registrationLink || "#register"}
                    className="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg text-center block transition duration-200 mb-4"
                  >
                    Register Now
                  </a>
                ) : (
                  <button className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg text-center mb-4 cursor-not-allowed">
                    Event Ended
                  </button>
                )}

                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-purple-900">
                    Share This Event
                  </h4>
                  <div className="flex space-x-2">
                    <button className="bg-purple-800 hover:bg-purple-700 text-white p-2 rounded-full">
                      <FaTwitter className="w-5 h-5" />
                    </button>
                    <button className="bg-purple-800 hover:bg-purple-700 text-white p-2 rounded-full">
                      <FaFacebook className="w-5 h-5" />
                    </button>
                    <button className="bg-purple-800 hover:bg-purple-700 text-white p-2 rounded-full">
                      <FaInstagram className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-purple-900">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full border border-purple-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-purple-200">
                  <p className="text-sm text-gray-500">
                    Created: {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Updated: {new Date(event.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventPage;
