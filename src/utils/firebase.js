// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhVNxfRVKJaO5o1U2AEN1i2ppV3nmzkMo",
  authDomain: "lb-events-12c36.firebaseapp.com",
  projectId: "lb-events-12c36",
  storageBucket: "lb-events-12c36.firebasestorage.app",
  messagingSenderId: "785483688138",
  appId: "1:785483688138:web:4448587b7ed6be21f2ac33",
  measurementId: "G-7ZJFFDH0ZL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);