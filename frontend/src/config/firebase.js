import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAz-_Xu3tmOB6VlLvDVEBETGcoy89jiPwE",
  authDomain: "monox-50fd3.firebaseapp.com",
  projectId: "monox-50fd3",
  storageBucket: "monox-50fd3.firebasestorage.app",
  messagingSenderId: "155489945019",
  appId: "1:155489945019:web:ee0306c5ce5c7d45bfb09e",
  measurementId: "G-J7743Q90EH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only in browser
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;