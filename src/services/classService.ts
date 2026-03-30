import { db } from '../config/firebase';
import { generateCode } from '../utils/generateCode';

const formatClassWithRelations = async (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
  const classData = doc.data();

  if (!classData?.teacherId) return null;

  const [teacherDoc, studentsSnap] = await Promise.all([
    db.collection('users').doc(classData.teacherId).get(),
    db.collection('users')
      .where('classIds', 'array-contains', doc.id)
      .get(),
  ]);

  return {
    id: doc.id,
    ...classData,
    teacher: teacherDoc.exists
      ? {
          id: teacherDoc.id,
          fullName: teacherDoc.data()?.fullName,
          email: teacherDoc.data()?.email,
        }
      : null,
    students: studentsSnap.docs.map(s => ({
      id: s.id,
      fullName: s.data().fullName,
      email: s.data().email,
    })),
  };
};

// ✅ CREATE CLASS
export const createClass = async (
  name: string,
  description: string,
  teacherId: string,
  organizationId: string
) => {
  const accessCode = generateCode(6);

  const classRef = await db.collection('classes').add({
    name,
    description,
    teacherId,
    organizationId,
    accessCode,
    createdAt: new Date().toISOString(),
  });

  return {
    id: classRef.id,
    accessCode,
  };
};

// ✅ GET ALL CLASSES (with teacher + students)
export const getClasses = async (organizationId: string) => {
  const snapshot = await db
    .collection('classes')
    .where('organizationId', '==', organizationId)
    .get();

  const classes = await Promise.all(
    snapshot.docs.map(doc => formatClassWithRelations(doc))
  );

  return classes.filter(Boolean);
};

// ✅ DELETE CLASS
export const deleteClass = async (classId: string, teacherId: string) => {
  const classDoc = await db.collection('classes').doc(classId).get();

  if (!classDoc.exists) throw new Error('Class not found');

  const classData = classDoc.data();

  if (classData?.teacherId !== teacherId) {
    throw new Error('Not authorized to delete this class');
  }

  const studentsSnap = await db
    .collection('users')
    .where('classIds', 'array-contains', classId)
    .get();

  const batch = db.batch();

  studentsSnap.docs.forEach(doc => {
    const data = doc.data();
    const updatedClassIds = (data.classIds || []).filter(
      (id: string) => id !== classId
    );

    batch.update(doc.ref, { classIds: updatedClassIds });
  });

  batch.delete(db.collection('classes').doc(classId));

  await batch.commit();

  return { message: 'Class deleted successfully' };
};

// ✅ GET CLASSES FOR STUDENT
export const getStudentClasses = async (classIds: string[]) => {
  if (!classIds || classIds.length === 0) return [];

  const classes = [];

  for (const classId of classIds) {
    const classDoc = await db.collection('classes').doc(classId).get();

    if (!classDoc.exists) continue;

    const classData = classDoc.data();

    // 🔥 Get teacher info
    const teacherDoc = await db
      .collection('users')
      .doc(classData?.teacherId)
      .get();

    classes.push({
      id: classDoc.id,
      ...classData,
      teacher: teacherDoc.exists
        ? { id: teacherDoc.id, ...teacherDoc.data() }
        : null,
    });
  }

  return classes;
};

export const getClassesByTeacher = async (teacherId: string) => {
  const snapshot = await db
    .collection('classes')
    .where('teacherId', '==', teacherId)
    .get();

  const classes = await Promise.all(
    snapshot.docs.map(doc => formatClassWithRelations(doc))
  );

  return classes.filter(Boolean);
};

export const getAllClasses = async (organizationId: string) => {
  const snapshot = await db
    .collection('classes')
    .where('organizationId', '==', organizationId)
    .get();

  const classes = await Promise.all(
    snapshot.docs.map(doc => formatClassWithRelations(doc))
  );

  return classes.filter(Boolean);
};