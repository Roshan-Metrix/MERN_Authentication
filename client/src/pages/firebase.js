// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// change your values according to the your firebase set up

const firebaseConfig = {
  apiKey: "AIzaSyAoQ9n67DXZzHWY7RGS3rjKCCVkDDANT4E",
  authDomain: "rohanmern.firebaseapp.com",
  projectId: "rohanmern",
  storageBucket: "rohanmern.firebasestorage.app",
  messagingSenderId: "63208067940",
  appId: "1:63208067940:web:d80f2c2975d65c26132071",
  measurementId: "G-94BKDZVVMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const googleProvider=new GoogleAuthProvider();

export {app,auth,googleProvider};
