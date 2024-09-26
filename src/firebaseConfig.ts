import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
const auth = getAuth(app);

export { app, db, auth };
