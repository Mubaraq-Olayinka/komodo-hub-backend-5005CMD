export interface Sighting {
  id?: string;
  userId: string;
  species: string;
  location: string;
  imageUrl?: string;
  createdAt: Date;
}