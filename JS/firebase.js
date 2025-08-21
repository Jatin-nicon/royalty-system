// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_Ba1qYHf-Fx0S0VTVx5xG7i_6xf53X7I",
  authDomain: "royalty-card-system-f9062.firebaseapp.com",
  projectId: "royalty-card-system-f9062",
  storageBucket: "royalty-card-system-f9062.firebasestorage.app",
  messagingSenderId: "709923769365",
  appId: "1:709923769365:web:8d2dd019eb28ab4fed521c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };
