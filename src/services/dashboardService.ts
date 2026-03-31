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

      db.collection("species").get(),
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

  let totalStudents = 0;

  for (const doc of classesSnap.docs) {
    const studentsSnap = await db
      .collection("users")
      .where("classIds", "array-contains", doc.id)
      .get();

    totalStudents += studentsSnap.size;
  }

  return {
    role: "teacher",
    classes: classesSnap.size,
    students: totalStudents,
  };
};

// ================= STUDENT =================
const getStudentStats = async (userId: string, classIds: string[] = []) => {
  const sightingsSnap = await db
    .collection("sightings")
    .where("userId", "==", userId)
    .get();

  return {
    role: "student",
    classes: classIds.length,
    sightings: sightingsSnap.size,
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
