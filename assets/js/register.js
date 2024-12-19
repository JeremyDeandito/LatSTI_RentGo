// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaNH2a84RYqs-YudbpsVlAG0KxV8jsWaM",
  authDomain: "tubes-lasti-50c77.firebaseapp.com",
  projectId: "tubes-lasti-50c77",
  storageBucket: "tubes-lasti-50c77.firebasestorage.app",
  messagingSenderId: "494223470348",
  appId: "1:494223470348:web:c055ce1c7b7610ff87a329",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Supabase configuration
const supabaseUrl = "https://fyxdwdblrxxiujsbrsiu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5eGR3ZGJscnh4aXVqc2Jyc2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1NDkzMTYsImV4cCI6MjA1MDEyNTMxNn0.fr79pI5ugXNRk77OQNFDaubTc96I4T0sk2AC_34pYtg";

// Inisialisasi Supabase client
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Get form elements
const form = document.querySelector("form");
const submitHost = document.getElementById("submit-host");
const submitRenter = document.getElementById("submit-renter");

async function registerUser(email, password, name, role) {
  try {
    // Validasi input
    if (!email || !password || !name) {
      throw new Error("Please fill in all fields");
    }

    console.log("Starting registration process...");
    console.log("Input data:", { email, name, role });

    // 1. Register di Supabase Auth
    const { data: authData, error: authError } =
      await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            role: role,
          },
        },
      });

    if (authError) throw authError;

    // 2. Simpan data user ke Supabase tabel users menggunakan ID dari auth
    console.log("Attempting to save to Supabase with role:", role);

    const userData = {
      id: authData.user.id, // Menggunakan ID dari Supabase Auth
      full_name: name,
      email: email,
      password: password,
      role: role,
    };
    console.log("Data to be inserted:", userData);

    const insertResponse = await supabaseClient.from("users").insert(userData);

    console.log("Full Supabase response:", insertResponse);

    if (insertResponse.error) {
      console.error("Detailed Supabase error:", {
        message: insertResponse.error.message,
        details: insertResponse.error.details,
        hint: insertResponse.error.hint,
        code: insertResponse.error.code,
      });
      throw new Error(`Database error: ${insertResponse.error.message}`);
    }

    // 3. Register di Firebase (sebagai backup/opsional)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Firebase registration successful:", userCredential.user.uid);

    console.log("Supabase insert successful:", insertResponse.data);
    alert(`Account created successfully as ${role}!`);

    // Redirect berdasarkan role
    if (role === "host") {
      window.location.href = "host/host.html";
    } else {
      window.location.href = "penyewa_gagal/penyewa2.html";
    }
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error stack:", error.stack);
    alert(error.message || "Registration failed. Please try again.");
  }
}

// Handler untuk Host registration
submitHost.addEventListener("click", async function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name = document.getElementById("name").value.trim();
  await registerUser(email, password, name, "host");
});

// Handler untuk Renter registration
submitRenter.addEventListener("click", async function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name = document.getElementById("name").value.trim();
  await registerUser(email, password, name, "renter");
});
