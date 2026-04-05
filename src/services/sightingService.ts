import { db } from '../config/firebase';
import { Sighting } from '../types/sighting';

export const createSighting = async (data: Sighting) => {
  const docRef = await db.collection('sightings').add({
    ...data,
    createdAt: new Date().toISOString(),
  });

  return docRef.id;
};

export const getSightings = async (userId: string): Promise<Sighting[]> => {
  const snapshot = await db
    .collection('sightings')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Sighting),
  }));
};