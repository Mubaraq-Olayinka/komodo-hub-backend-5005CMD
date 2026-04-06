export interface Sighting {
  id?: string;
  userId: string;
  speciesName: string;
  location: string;
  description?: string;
  createdAt: string;
}