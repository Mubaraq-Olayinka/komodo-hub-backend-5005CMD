import { db } from "../config/firebase";

export const createCanvas = async (
  userId: string,
  title: string,
  description: string,
) => {
  const canvasRef = await db.collection("canvases").add({
    userId,
    title,
    description,
    createdAt: new Date().toISOString(),
  });

  return { id: canvasRef.id };
};

export const getUserCanvases = async (userId: string) => {
  const snapshot = await db
    .collection("canvases")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
