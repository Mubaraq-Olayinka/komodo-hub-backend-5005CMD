import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
};

const app = initializeApp(firebaseConfig);

export const clientAuth = getAuth(app);
