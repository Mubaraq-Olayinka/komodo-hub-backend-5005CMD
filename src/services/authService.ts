import { db, auth } from '../config/firebase';
import { generateCode } from '../utils/generateCode';

// ================= STUDENT =================
export const createStudent = async (
  fullName: string,
  email: string,
  password: string,
  accessCode: string
) => {
  // Verify class access code
  const classSnap = await db
    .collection('classes')
    .where('accessCode', '==', accessCode)
    .limit(1)
    .get();

  if (classSnap.empty) throw new Error('Invalid access code');

  const classDoc = classSnap.docs[0];
  const classData = classDoc.data();

  // Create Firebase Auth user
  const userRecord = await auth.createUser({ email, password, displayName: fullName });

  // Add to Firestore
  await db.collection('users').doc(userRecord.uid).set({
    fullName,
    email,
    role: 'student',
    organizationId: classData.organizationId,
    classIds: [classDoc.id],
    createdAt: new Date(),
  });

  return { uid: userRecord.uid };
};

// ================= TEACHER =================
export const createTeacher = async (
  fullName: string,
  email: string,
  password: string,
  inviteCode: string
) => {
  const orgSnap = await db
    .collection('organizations')
    .where('inviteCode', '==', inviteCode)
    .limit(1)
    .get();

  if (orgSnap.empty) throw new Error('Invalid invite code');

  const orgDoc = orgSnap.docs[0];

  const userRecord = await auth.createUser({ email, password, displayName: fullName });

  await db.collection('users').doc(userRecord.uid).set({
    fullName,
    email,
    role: 'teacher',
    organizationId: orgDoc.id,
    createdAt: new Date(),
  });

  return { uid: userRecord.uid };
};

// ================= ORGANIZATION =================
export const createOrganization = async (
  fullName: string,
  email: string,
  password: string,
  organizationName: string,
  region: string,
  description: string
) => {
  const userRecord = await auth.createUser({ email, password, displayName: fullName });

  const inviteCode = generateCode();

  const orgRef = await db.collection('organizations').add({
    name: organizationName,
    region,
    description,
    createdBy: userRecord.uid,
    inviteCode,
    createdAt: new Date(),
  });

  await db.collection('users').doc(userRecord.uid).set({
    fullName,
    email,
    role: 'org_admin',
    organizationId: orgRef.id,
    createdAt: new Date(),
  });

  return {
    uid: userRecord.uid,
    inviteCode,
  };
};

// ================= LOGIN =================
export const loginUser = async (email: string, password: string) => {
  // Find user in Firestore
  const userSnap = await db
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (userSnap.empty) throw new Error('User not found');

  const userDoc = userSnap.docs[0];
  const userData = userDoc.data();

  // You can implement password check using a hashed password stored in Firestore
  // Or if you want Firebase Auth to handle it:
  // Generate a custom token from Firebase Admin SDK
  const customToken = await auth.createCustomToken(userDoc.id);

  return {
    uid: userDoc.id,
    role: userData.role,
    token: customToken,
  };
};