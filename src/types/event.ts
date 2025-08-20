export interface Event {
  id: string;
  title: string;
  bannerUrl: string;
  category: "conference" | "meetup" | "hackathon" | "workshop" | "x-space";
  description: string;
  startDate: any;
  endDate: any;
  location: {
    type: "physical" | "virtual";
    details: string;
  };
  registrationLink: string;
  gallery?: string[];
  albumUrl?: string; // URL to full photo album (Google Photos, Flickr, etc.)
  stats?: {
    attendees?: number;
    engagement?: number;
    feedback?: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}
