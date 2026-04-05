import { db } from "../config/firebase";

// ================= ADMIN =================
const getAdminStats = async (organizationId: string) => {
  const [studentsSnap, teachersSnap, classesSnap, speciesSnap] =
    await Promise.all([
      db
        .collection("users")
        .where("role", "==", "student")
        .where("organizationId", "==", organizationId)
        .get(),

      db
        .collection("users")
        .where("role", "==", "teacher")
        .where("organizationId", "==", organizationId)
        .get(),

      db
        .collection("classes")
        .where("organizationId", "==", organizationId)
        .get(),

      db
        .collection("species")
        .where("organizationId", "==", organizationId)
        .get(),
    ]);

  return {
    role: "org_admin",
    students: studentsSnap.size,
    teachers: teachersSnap.size,
    classes: classesSnap.size,
    species: speciesSnap.size,
  };
};

// ================= TEACHER =================
const getTeacherStats = async (teacherId: string) => {
  const classesSnap = await db
    .collection("classes")
    .where("teacherId", "==", teacherId)
    .get();

  const classIds = classesSnap.docs.map((doc) => doc.id);
  let totalStudents = 0;

  for (const doc of classesSnap.docs) {
    const studentsSnap = await db
      .collection("users")
      .where("classIds", "array-contains", doc.id)
      .get();

    totalStudents += studentsSnap.size;
  }

  const [speciesSnap, submissionsSnap] = await Promise.all([
    db.collection("species").where("teacherId", "==", teacherId).get(),
    db
      .collection("submissions")
      .where("classId", "in", classIds)
      .get(),
  ]);

  return {
    role: "teacher",
    classes: classesSnap.size,
    students: totalStudents,
    species: speciesSnap.size,
    submissions: submissionsSnap.size,
  };
};

// ================= STUDENT =================
const getStudentStats = async (userId: string, classIds: string[] = []) => {
  const [sightingsSnap, submissionsSnap] = await Promise.all([
    db.collection("sightings").where("userId", "==", userId).get(),
    db.collection("submissions").where("userId", "==", userId).get(),
  ]);

  // Graded activities (submissions with a grade)
  const gradedActivities = submissionsSnap.docs.filter(
    (doc) => doc.data().grade !== undefined && doc.data().grade !== null
  ).length;

  // Enrolled class names
  const classNames: string[] = [];
  if (classIds.length > 0) {
    const chunks = [];
    for (let i = 0; i < classIds.length; i += 30) {
      chunks.push(classIds.slice(i, i + 30));
    }
    for (const chunk of chunks) {
      const classesSnap = await db
        .collection("classes")
        .where("__name__", "in", chunk)
        .get();
      classesSnap.docs.forEach((doc) => classNames.push(doc.data().name));
    }
  }

  // Species discovered (unique species across all sightings)
  const uniqueSpecies = new Set(
    sightingsSnap.docs.map((doc) => doc.data().speciesId).filter(Boolean)
  ).size;

  return {
    role: "student",
    sightings: sightingsSnap.size,
    gradedActivities,
    enrolledClasses: classNames,
    uniqueSpeciesDiscovered: uniqueSpecies,
  };
};

// ================= MAIN =================
export const getDashboardStats = async (user: any) => {
  if (user.role === "org_admin") {
    return getAdminStats(user.organizationId);
  }

  if (user.role === "teacher") {
    return getTeacherStats(user.uid);
  }

  if (user.role === "student") {
    return getStudentStats(user.uid, user.classIds);
  }

  throw new Error("Invalid role");
};
