// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaNH2a84RYqs-YudbpsVlAG0KxV8jsWaM",
  authDomain: "tubes-lasti-50c77.firebaseapp.com",
  projectId: "tubes-lasti-50c77",
  storageBucket: "tubes-lasti-50c77.firebasestorage.app",
  messagingSenderId: "494223470348",
  appId: "1:494223470348:web:c055ce1c7b7610ff87a329"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Get form elements
const form = document.querySelector('form');
const submit = document.querySelector('.submit-btn');

submit.addEventListener('click', function(event) {
    event.preventDefault();

    // Get input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            alert("Login successful!");
            window.location.href = "../../home-penyewa.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});
