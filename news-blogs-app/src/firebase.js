import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB5VXMVi7gBiE1c1uSuG04VSQwG2H7o-Qw",
  authDomain: "simplefeed-ddbe5.firebaseapp.com",
  databaseURL: "https://simplefeed-ddbe5-default-rtdb.firebaseio.com",
  projectId: "simplefeed-ddbe5",
  storageBucket: "simplefeed-ddbe5.firebasestorage.app",
  messagingSenderId: "739898019638",
  appId: "1:739898019638:web:0ad40969ea525441e66d97",
  measurementId: "G-2XN212S31S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 