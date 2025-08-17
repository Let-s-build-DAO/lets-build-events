export interface Event {
  id: string;
  title: string;
  bannerUrl: string;
  category: 'conference' | 'meetup' | 'hackathon' | 'workshop' | 'x-space';
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    type: 'physical' | 'virtual';
    details: string;
  };
  registrationLink: string;
  gallery?: string[];
  stats?: {
    attendees?: number;
    engagement?: number;
    feedback?: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
