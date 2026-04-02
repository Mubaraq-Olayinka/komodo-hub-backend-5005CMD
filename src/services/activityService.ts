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
    className: classData?.name,
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

export const getActivitiesByTeacher = async (teacherId: string) => {
  // 1️⃣ Get all classes owned by teacher
  const classesSnap = await db
    .collection('classes')
    .where('teacherId', '==', teacherId)
    .get();

  const classMap: Record<string, string> = {};

  classesSnap.docs.forEach(doc => {
    classMap[doc.id] = doc.data().name;
  });

  const classIds = Object.keys(classMap);

  if (classIds.length === 0) return [];

  // 2️⃣ Get activities for those classes
  const activitiesSnap = await db
    .collection('activities')
    .where('classId', 'in', classIds.slice(0, 10)) // Firestore limit
    .get();

  return activitiesSnap.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate || null,
      className: classMap[data.classId] || 'Unknown Class',
    };
  });
};