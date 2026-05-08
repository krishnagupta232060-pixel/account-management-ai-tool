import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAzZ3llOolmbvw2iVeRbKzG83rVoy_C8W0",
  authDomain: "amat-ai.firebaseapp.com",
  projectId: "amat-ai",
  storageBucket: "amat-ai.firebasestorage.app",
  messagingSenderId: "90778274456",
  appId: "1:90778274456:web:e642a3fbf05120aef51eed",
  measurementId: "G-FHT0EM47DS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();