import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoXSOeFcO9UWcZgxr2TwaMeW9GYkYZi6I",
  authDomain: "roulette-f9d63.firebaseapp.com",
  projectId: "roulette-f9d63",
  storageBucket: "roulette-f9d63.appspot.com",
  messagingSenderId: "932120111799",
  appId: "1:932120111799:web:7059d0ced90a4989593b32",
};

// ✅ Esta línea evita el error de duplicado:
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);