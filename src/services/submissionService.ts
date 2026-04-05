import { db, bucket } from '../config/firebase';

// ================= CREATE SUBMISSION =================
export const createSubmission = async (
  activityId: string,
  studentId: string,
  content: string,
  file?: Express.Multer.File
) => {
  // 🔐 Ensure activity exists
  const activityDoc = await db.collection('activities').doc(activityId).get();

  if (!activityDoc.exists) {
    throw new Error('Activity not found');
  }

  const activityData = activityDoc.data();

  // 🔐 Ensure student is in the class
  const userDoc = await db.collection('users').doc(studentId).get();

  if (!userDoc.exists) throw new Error('User not found');

  const userData = userDoc.data();

  if (!userData?.classIds?.includes(activityData?.classId)) {
    throw new Error('Not enrolled in this class');
  }

  let fileUrl: string | null = null;

  // 📄 Upload PDF (if exists)
  if (file) {
    const fileName = `submissions/${studentId}_${Date.now()}_${file.originalname}`;

    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      contentType: file.mimetype,
    });

    await fileUpload.makePublic();

    fileUrl = fileUpload.publicUrl();
  }

  // 💾 Save submission
  const submissionRef = await db.collection('submissions').add({
    activityId,
    activityTitle : activityData?.title,
    studentId,
    content,
    fileUrl,
    status: 'pending',
    grade: null,
    feedback: null,
    createdAt: new Date().toISOString(),
  });

  return {
    id: submissionRef.id,
    fileUrl,
  };
};

// ================= GET TEACHER SUBMISSIONS =================
export const getTeacherSubmissions = async (teacherId: string) => {
  // 1️⃣ Get teacher classes
  const classesSnap = await db
    .collection('classes')
    .where('teacherId', '==', teacherId)
    .get();

  const classIds = classesSnap.docs.map(doc => doc.id);

  if (classIds.length === 0) return [];

  // 2️⃣ Get activities in those classes
  const activitiesSnap = await db
    .collection('activities')
    .where('classId', 'in', classIds.slice(0, 10))
    .get();

  const activityMap: Record<string, any> = {};

  activitiesSnap.docs.forEach(doc => {
    activityMap[doc.id] = doc.data();
  });

  const activityIds = Object.keys(activityMap);

  if (activityIds.length === 0) return [];

  // 3️⃣ Get submissions
  const submissionsSnap = await db
    .collection('submissions')
    .where('activityId', 'in', activityIds.slice(0, 10))
    .get();

  // 4️⃣ Attach student info
  const results = [];

  for (const doc of submissionsSnap.docs) {
    const data = doc.data();

    const studentDoc = await db
      .collection('users')
      .doc(data.studentId)
      .get();

    results.push({
      id: doc.id,
      ...data,
      activityTitle: activityMap[data.activityId]?.title,
      student: studentDoc.exists
        ? {
            id: studentDoc.id,
            fullName: studentDoc.data()?.fullName,
            email: studentDoc.data()?.email,
          }
        : null,
    });
  }

  return results;
};

export const gradeSubmission = async (
  submissionId: string,
  teacherId: string,
  grade: number,
  feedback: string
) => {
  const submissionDoc = await db
    .collection('submissions')
    .doc(submissionId)
    .get();

  if (!submissionDoc.exists) {
    throw new Error('Submission not found');
  }

  const submissionData = submissionDoc.data();

  // 🔐 Get activity
  const activityDoc = await db
    .collection('activities')
    .doc(submissionData?.activityId)
    .get();

  if (!activityDoc.exists) {
    throw new Error('Activity not found');
  }

  const activityData = activityDoc.data();

  // 🔐 Get class
  const classDoc = await db
    .collection('classes')
    .doc(activityData?.classId)
    .get();

  if (!classDoc.exists) {
    throw new Error('Class not found');
  }

  // 🔐 Ensure teacher owns the class
  if (classDoc.data()?.teacherId !== teacherId) {
    throw new Error('Not authorized to grade this submission');
  }

  // ✅ Update submission
  await db.collection('submissions').doc(submissionId).update({
    grade,
    feedback,
    status: 'graded',
  });

  return { message: 'Submission graded successfully' };
};

export const getStudentSubmissions = async (studentId: string) => {
  const submissionsSnap = await db
    .collection("submissions")
    .where("studentId", "==", studentId)
    .orderBy("createdAt", "desc")
    .get();

  return submissionsSnap.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      activityId: data.activityId,
      activityTitle: data.activityTitle,
      content: data.content,
      fileUrl: data.fileUrl,
      status: data.status,
      grade: data.grade,
      feedback: data.feedback,
      createdAt: data.createdAt,
    };
  });
};