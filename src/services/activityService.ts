import { db } from '../config/firebase';

export const createActivity = async (
  classId: string,
  title: string,
  description: string,
  teacherId: string,
  organizationId: string,
  dueDate?: string
) => {
  // 🔐 Ensure class exists
  const classDoc = await db.collection('classes').doc(classId).get();

  if (!classDoc.exists) {
    throw new Error('Class not found');
  }

  const classData = classDoc.data();

  // 🔐 Ensure teacher owns the class
  if (classData?.teacherId !== teacherId) {
    throw new Error('Not authorized to create activity for this class');
  }

  const activityRef = await db.collection('activities').add({
    classId,
    title,
    description,
    dueDate: dueDate || null,
    createdBy: teacherId,
    organizationId,
    createdAt: new Date().toISOString(),
  });

  return {
    id: activityRef.id,
  };
};