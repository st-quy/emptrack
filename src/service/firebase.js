import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCwLYrz6YLaG746djdUbE4WAisKxgP1t2s",
  authDomain: "zerot-api.firebaseapp.com",
  databaseURL: "https://zerot-api-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zerot-api",
  storageBucket: "zerot-api.appspot.com",
  messagingSenderId: "1001253828680",
  appId: "1:1001253828680:web:e4696ec4a2456bcbb4807d",
  measurementId: "G-HR2Z9H9G81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};

