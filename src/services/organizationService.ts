import { db } from '../config/firebase';
import { Organization, OrganizationDetails } from '../types/organization';

export const getAllOrganizations = async (): Promise<Organization[]> => {
  const snapshot = await db.collection('organizations').get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Organization),
  }));
};

export const getOrganizationById = async (id: string): Promise<OrganizationDetails | null> => {
  const doc = await db.collection('organizations').doc(id).get();

  if (!doc.exists) return null;

  const data = doc.data() as OrganizationDetails;

  return {
    id: doc.id,
    ...data,
    statistics: data.statistics || { teachers: 0, classes: 0, students: 0, sightings: 0 },
    highlights: data.highlights || [],
  };
};