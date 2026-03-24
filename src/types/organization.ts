export interface Organization {
  id?: string;
  name: string;
  type: 'school' | 'community';
  location: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface OrganizationDetails extends Organization {
  statistics: {
    teachers: number;
    classes: number;
    students: number;
    sightings: number;
  };
  highlights: {
    title: string;
    description: string;
  }[];
}