# 🏆 Royalty System

A complete **Royalty Points Management System** built using **Firebase**, HTML, CSS, and JavaScript. Designed for shop owners to track customer purchases and manage points like a digital loyalty card.

---

## 🔗 Live Demo

🌐 [Visit the App](https://royalty-card-system-f9062.web.app/)

---

## 📱 Features

- 🔐 Admin Authentication with Firebase
- 👥 User Registration & Login
- 🛒 Add Customer Purchases
- 💰 Points Earned & Redeemed Automatically
- 📈 Admin Dashboard with:
  - Customer Search by Name, Email, or Phone
  - Points Update
  - Purchase History
- 📦 Firebase Firestore used for:
  - Storing User Profiles
  - Storing Purchase Records as Subcollections
- 🔧 Responsive Admin Panel (Mobile + Desktop)
- 📤 Firebase Hosting

---

## 🛠️ Tech Stack

| Technology | Purpose                |
|------------|------------------------|
| Firebase   | Auth, Firestore, Hosting |
| HTML/CSS   | UI Design              |
| JavaScript | Client-side Logic      |
| GitHub     | Source Control & APK Hosting |

---

## 📁 Project Structure

royalty-system/
│
├── adminHTML/ # Admin Pages
│ ├── dashboard.html
│ ├── billing.html
│ └── unauthorized.html
│
├── adminCSS/ # Admin Styling
│
├── adminJS/ # Admin Scripts
│ ├── firebase.js # Firebase Config
│ ├── dashboard.js # Admin Dashboard
│ ├── unauthorized.js
│ └── billing.js
│
├── userAPK/ # Android App APK
│ └── app-release.apk
│
├── Images/ # Logos, Icons, etc.
│
└── index.html # Redirect or Landing

yaml
Copy
Edit

---

## 🔧 Setup Instructions

1. **Clone the repo:**

git clone https://github.com/Jatin-nicon/royalty-system.git
cd royalty-system
Set up Firebase:

Create a project at Firebase Console

Enable Authentication (Email/Password)

Create Firestore Database

Add your Firebase config to /adminJS/firebase.js

Host on Firebase:

bash
Copy
Edit
firebase init
firebase deploy
🧠 Project Use Case
Created for a real-world small business to digitally track purchases and assign loyalty points without using physical cards. This project is also ideal for learning:

Firebase integration

Full frontend-to-backend connection

Real-time data management

📦 APK Distribution
The Android app APK is hosted in the userAPK folder.
You can download it directly from GitHub.

🙌 Acknowledgements
Firebase

Material Symbols

[OpenAI for brainstorming help 😄]
