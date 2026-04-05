import { db } from '../config/firebase';

// ✅ SEND MESSAGE
export const sendMessage = async (
  senderId: string,
  senderName: string,
  senderEmail: string,
  receiverEmail: string,
  message: string
) => {
  // 🔍 Find receiver
  const userSnap = await db
    .collection('users')
    .where('email', '==', receiverEmail)
    .limit(1)
    .get();

  if (userSnap.empty) {
    throw new Error('Receiver not found');
  }

  const receiverDoc = userSnap.docs[0];

  // ✅ Save message
  const msgRef = await db.collection('messages').add({
    senderId,
    senderName,
    senderEmail,
    receiverId: receiverDoc.id,
    receiverEmail,
    message,
    createdAt: new Date().toISOString(),
  });

  return { id: msgRef.id };
};

// ✅ GET MESSAGES FOR USER
export const getUserMessages = async (userId: string) => {
  const snapshot = await db
    .collection('messages')
    .where('receiverId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    senderName: doc.data().senderName,
    senderEmail: doc.data().senderEmail,
    message: doc.data().message,
    createdAt: doc.data().createdAt,
  }));
};