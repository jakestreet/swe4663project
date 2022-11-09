// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjbNqX9c5JPpgnuCT9S-hgCHEnu46wgOA",
  authDomain: "swe4663project.firebaseapp.com",
  projectId: "swe4663project",
  storageBucket: "swe4663project.appspot.com",
  messagingSenderId: "862264755256",
  appId: "1:862264755256:web:ee52b4bc5f7c60ce9852cd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const appCreate = initializeApp(firebaseConfig, "secondary");
export const auth = getAuth(app);
export const authCreate = getAuth(appCreate);