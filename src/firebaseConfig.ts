// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDYLCWLu2a_L-C6zmI_-PVPQVhlHWkj2II",
  authDomain: "codetracker-46cd5.firebaseapp.com",
  projectId: "codetracker-46cd5",
  storageBucket: "codetracker-46cd5.appspot.com",
  messagingSenderId: "82398464229",
  appId: "1:82398464229:web:82236d57fc484bf3edec0c",
  measurementId: "G-3RPX8W3GSM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 