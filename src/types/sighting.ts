export interface Sighting {
  id?: string;
  userId: string;
  species: string;
  location: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
}