import { db } from '../config/firebase';
import { Sighting } from '../types/sighting';

export const createSighting = async (data: Sighting) => {
  const docRef = await db.collection('sightings').add({
    ...data,
    createdAt: new Date(),
  });

  return docRef.id;
};

export const getSightings = async (): Promise<Sighting[]> => {
  const snapshot = await db.collection('sightings').get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Sighting),
  }));
};