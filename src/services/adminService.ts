import { db } from '../config/firebase';

// Get all teachers
export const getAllTeachers = async () => {
  const snapshot = await db
    .collection('users')
    .where('role', '==', 'teacher')
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      status: data.status || 'active', // ✅ fallback
      createdAt: data.createdAt
        ? new Date(data.createdAt).toISOString()
        : null, // ✅ normalize
    };
  });
};

// Suspend teacher
export const suspendTeacher = async (teacherId: string) => {
  await db.collection('users').doc(teacherId).update({
    status: 'suspended',
  });

  return { message: 'Teacher suspended successfully' };
};

// Activate teacher
export const activateTeacher = async (teacherId: string) => {
  await db.collection('users').doc(teacherId).update({
    status: 'active',
  });

  return { message: 'Teacher activated successfully' };
};