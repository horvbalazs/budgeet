// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAnZ2PtnG8upUBXpEBJT-G0P_mj7Gtxjgc',
  authDomain: 'finance-help-3e00b.firebaseapp.com',
  projectId: 'finance-help-3e00b',
  storageBucket: 'finance-help-3e00b.appspot.com',
  messagingSenderId: '369131896861',
  appId: '1:369131896861:web:d510445e24920d3c3986f4',
  measurementId: 'G-ZEFE416JDL',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, db };
