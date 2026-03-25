import { db, auth } from '../config/firebase';
import { generateCode } from '../utils/generateCode';
import { clientAuth } from '../config/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';

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

  // Generate token
  const token = await auth.createCustomToken(userRecord.uid);

  return { uid: userRecord.uid, token };
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

  const token = await auth.createCustomToken(userRecord.uid);

  return { uid: userRecord.uid, token };
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

  const token = await auth.createCustomToken(userRecord.uid);

  return { uid: userRecord.uid, inviteCode, token };
};

// ================= LOGIN =================
export const loginUser = async (email: string, password: string) => {
  // 1️⃣ Sign in using Firebase client SDK to get an ID token
  const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
  const idToken = await userCredential.user.getIdToken(); // ✅ ID token for Authorization header

  // 2️⃣ Fetch user data from Firestore
  const userSnap = await db
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (userSnap.empty) throw new Error('User not found in database');

  const userDoc = userSnap.docs[0];
  const userData = userDoc.data();

  // 3️⃣ Return uid, role, and ID token
  return {
    uid: userDoc.id,
    role: userData.role,
    token: idToken, // This is what you use in Authorization header
  };
};