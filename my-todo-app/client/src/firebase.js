// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAC8Ncp7NpfsyiUmY7szSDBguNKENDxTEc",
  authDomain: "my-todo-auth.firebaseapp.com",
  projectId: "my-todo-auth-d676e",
  storageBucket: "my-todo-auth.appspot.com",
  messagingSenderId: "245863899474",
  appId: "1:245863899474:web:953f7a1c893909f71d1a8b"
};

// ✅ Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Firestore

// ✅ Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ✅ Export everything you need
export {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signOut,
  db,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc
};