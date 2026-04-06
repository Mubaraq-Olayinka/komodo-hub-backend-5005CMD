export interface Sighting {
  id?: string;
  userId: string;
  speciesName: string;
  location: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
}