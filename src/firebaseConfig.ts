// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDYLCWLv2a_L-C6zmI_-PVPQv1hHWkj2TI",
  authDomain: "codetracker-46cd5.firebaseapp.com",
  projectId: "codetracker-46cd5",
  storageBucket: "codetracker-46cd5.appspot.com",
  messagingSenderId: "82398464229",
  appId: "1:82398464229:web:4a3c003b7ee52280edec0c",
  measurementId: "G-B7N1L4YDHS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 