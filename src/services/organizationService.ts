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

export const updateOrganization = async (
  id: string,
  updates: Partial<OrganizationDetails>
) => {
  const docRef = db.collection('organizations').doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Organization not found');
  }

  await docRef.update({
    ...updates,
  });

  const updatedDoc = await docRef.get();

  return {
    id: updatedDoc.id,
    ...(updatedDoc.data() as OrganizationDetails),
  };
};

export const getDashboardStats = async (organizationId: string) => {
  // 🔥 Run queries in parallel
  const [studentsSnap, teachersSnap, classesSnap, speciesSnap] =
    await Promise.all([
      db
        .collection('users')
        .where('role', '==', 'student')
        .where('organizationId', '==', organizationId)
        .get(),

      db
        .collection('users')
        .where('role', '==', 'teacher')
        .where('organizationId', '==', organizationId)
        .get(),

      db
        .collection('classes')
        .where('organizationId', '==', organizationId)
        .get(),

      db.collection('species').get(), // global
    ]);

  return {
    students: studentsSnap.size,
    teachers: teachersSnap.size,
    classes: classesSnap.size,
    species: speciesSnap.size,
  };
};