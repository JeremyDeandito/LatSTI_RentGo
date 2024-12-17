// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const submitHost = document.getElementById('submit-host');
const submitRenter = document.getElementById('submit-renter');

// Handler for Host registration
submitHost.addEventListener('click', function(event) {
    event.preventDefault();

    // Get input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            alert("Account created successfully!");
            window.location.href = "host/host.html";  // Redirect to host page
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
        });
});

// Handler for Renter registration
submitRenter.addEventListener('click', function(event) {
    event.preventDefault();

    // Get input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            alert("Account created successfully!");
            window.location.href = "renter/renter.html";  // Redirect to renter page
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage);
        });
});
