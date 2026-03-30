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
  const classSnap = await db
    .collection('classes')
    .where('accessCode', '==', accessCode)
    .limit(1)
    .get();
  if (classSnap.empty) throw new Error('Invalid access code');

  const classDoc = classSnap.docs[0];
  const classData = classDoc.data();

  const userRecord = await auth.createUser({ email, password, displayName: fullName });

  await db.collection('users').doc(userRecord.uid).set({
    fullName,
    email,
    role: 'student',
    organizationId: classData.organizationId,
    classIds: [classDoc.id],
    createdAt: new Date().toISOString(),
  });

  // Sign in user via client SDK to get Firebase ID token
  const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
  const idToken = await userCredential.user.getIdToken();

  return { uid: userRecord.uid, token: idToken, organizationId: classData.organizationId };
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
    status: 'active',
    createdAt: new Date().toISOString(),
  });

  const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
  const idToken = await userCredential.user.getIdToken();

  return { uid: userRecord.uid, token: idToken, organizationId: orgDoc.id };
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
    createdAt: new Date().toISOString(),
  });

  await db.collection('users').doc(userRecord.uid).set({
    fullName,
    email,
    role: 'org_admin',
    organizationId: orgRef.id,
    createdAt: new Date().toISOString(),
  });

  const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
  const idToken = await userCredential.user.getIdToken();

  return { uid: userRecord.uid, inviteCode, token: idToken, organizationId: orgRef.id };
};

// ================= LOGIN =================
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
  const idToken = await userCredential.user.getIdToken();

  const userSnap = await db
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();
  if (userSnap.empty) throw new Error('User not found in database');

  const userDoc = userSnap.docs[0];
  const userData = userDoc.data();

  return {
    uid: userDoc.id,
    role: userData.role,
    token: idToken,
    organizationId: userData.organizationId || null,
  };
};