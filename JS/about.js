import { auth } from "./firebase.js"
import { signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "./index.html"
    }
})

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






// Designing part

if (window.screen.width > 768) {
    // making the gap b/w header and main section
    let main = document.querySelector("main");
    let mainPaddingTop = document.querySelector(".big-nav").offsetHeight;
    main.style.paddingTop = mainPaddingTop + "px";


    // Giving function to the nav elements
    let profilePage = document.querySelector("#profile");
    let dashboardPage = document.querySelector("#dashboard");

    profilePage.addEventListener('click', () => {
        window.location.href = "./profile.html"
    })

    dashboardPage.addEventListener('click', () => {
        window.location.href = "./dashboard.html"
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
