import {auth, db} from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {collection, query, where, getDocs} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Data fetching and showing part
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.querySelector(".loader").classList.add('hide');
        document.querySelector(".data").classList.remove('hide');

        try {
            let usersCollection = collection(db, "users");
            let q = query(usersCollection, where("uid", "==", user.uid));
            let querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let userData = doc.data();

                document.querySelector("#headName h3").innerText = `${userData.firstName}'s Details`;
                document.querySelector("#name").innerHTML = `<strong>Name:</strong> ${userData.firstName} ${userData.lastName}`;
                document.querySelector("#email").innerHTML = `<strong>Email:</strong> ${userData.email}`;
                document.querySelector("#phone").innerHTML = `<strong>Phone:</strong> ${userData.phone}`;
                document.querySelector('#age').innerHTML = `<strong>Age:</strong> ${userData.age} years`;

                document.querySelector(".loader").classList.add('hide');
                document.querySelector(".data").classList.remove('hide');

            })

        } catch (error) {
            console.error("Error fetching user data:", error);
        }


    } else {
        window.location.href = "../index.html";
        console.error("No user is logged in");
    }
})

// giving function to logout button
let logoutBtn = document.querySelector("#logout");
let sLogoutBtn = document.querySelector("#s-logout");
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log("User logged out.");
        window.location.href = "./index.html"; // Redirect to login page
    }).catch((error) => {
        alert("Error logging out: " + error.message);
    });
});

sLogoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log("User logged out.");
        window.location.href = "./index.html"; // Redirect to login page
    }).catch((error) => {
        alert("Error logging out: " + error.message);
    });
});


// Designing Part
if (window.screen.width > 768) {
    // making the gap b/w header and main section
    let main = document.querySelector("main");
    let mainPaddingTop = document.querySelector(".big-nav").offsetHeight;
    main.style.paddingTop = mainPaddingTop + "px";

    // Giving function to the nav elements
    let dashboardPage = document.querySelector("#dashboard");
    let aboutPage = document.querySelector("#about");

    dashboardPage.addEventListener('click', () => {
        window.location.href = "./dashboard.html"
    })

    aboutPage.addEventListener('click', () => {
        window.location.href = "./about.html"
    })
}



if (window.screen.width < 768) {
    // making the gap b/w header and main section
    let main = document.querySelector("main");
    let mainPaddingTop = document.querySelector(".small-nav").offsetHeight;
    main.style.paddingTop = mainPaddingTop + "px";


    // making menu icon open and close
    document.getElementById("menuIcon").addEventListener("click", function () {
        this.classList.toggle("open");
    });
}


