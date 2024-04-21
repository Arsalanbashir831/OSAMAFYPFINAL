// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEcrufpMaYSg0u-6bAtOQJben8WVRhF4c",
  authDomain: "cricket-3bbad.firebaseapp.com",
  projectId: "cricket-3bbad",
  storageBucket: "cricket-3bbad.appspot.com",
  messagingSenderId: "151418589208",
  appId: "1:151418589208:web:bfe2500d079e899a4b736d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth};