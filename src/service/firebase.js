import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCgCzZQkejjqADT_2gJhPXQ9RDsWOsj4Y4",
  authDomain: "zero-api-a307a.firebaseapp.com",
  databaseURL: "https://zero-api-a307a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zero-api-a307a",
  storageBucket: "zero-api-a307a.appspot.com",
  messagingSenderId: "332366664231",
  appId: "1:332366664231:web:6e2018d35d1595b55cf402",
  measurementId: "G-22Z3HN0S4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};

