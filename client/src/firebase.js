// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// console.log(import.meta.env.VITE_FIREBASE_API_KEY);
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-8a988.firebaseapp.com",
  projectId: "mern-blog-8a988",
  storageBucket: "mern-blog-8a988.appspot.com",
  messagingSenderId: "428935673369",
  appId: "1:428935673369:web:d831dce244253feabd9c88"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);