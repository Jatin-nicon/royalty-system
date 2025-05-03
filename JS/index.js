import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let terms = urlParams.get('terms')
if (terms) {
    document.querySelector(".earn-credits").classList.add("hide");
    document.querySelector(".use-credits").classList.add("hide");
}



onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = './dashboard.html'
    } 
    else {
        document.querySelector(".loader").classList.add('hide');
        document.querySelector(".data").classList.remove('hide');

        // Creating a veritical line b/w hindi and english section if screen size is greater than 768px
        if (window.screen.width > 768) {
            let verticalLine = document.querySelectorAll(".vertical-line");
            let verticalLineHeight = document.querySelectorAll(".left");

            for (let i = 0; i < verticalLine.length; i++) {
            verticalLine[i].style.height = verticalLineHeight[i].offsetHeight + "px";
            }

            let main = document.querySelector("main");
            let mainPaddingTop = document.querySelector(".big-nav").offsetHeight;
            main.style.paddingTop = mainPaddingTop + "px";

        }
        document.querySelector(".big-nav button").addEventListener('click', () => {
            window.location.href = "./login.html?login=true";
        })



        if (window.screen.width < 768) {
            // making the Get Started with us button Get Started in header and footer
            let headerButton = document.querySelector("header button");
            let footerButton = document.querySelector("footer button");
            headerButton.innerText = "Get Started";
            footerButton.innerText = "Get Started";

            // making the gap b/w header and main section
            let main = document.querySelector("main");
            let mainPaddingTop = document.querySelector(".small-nav").offsetHeight;
            main.style.paddingTop = mainPaddingTop + "px";


            // hiding the hindi part intially in small screen
            document.querySelectorAll(".right").forEach((el) => {
                el.classList.toggle("hide");
            });
            // Function of toggle button in small screen
            
            const toggle = document.querySelector('.toggle-switch input');

            toggle.addEventListener('change', function () {
                if (this.checked) {
                    // ✅ Toggle is ON
                    document.querySelectorAll(".left").forEach((el) => {
                        el.classList.toggle("hide");
                    });
                    document.querySelectorAll(".right").forEach((el) => {
                        el.classList.toggle("hide");
                    });
                } else {
                    document.querySelectorAll(".left").forEach((el) => {
                        el.classList.toggle("hide");
                    });
                    document.querySelectorAll(".right").forEach((el) => {
                        el.classList.toggle("hide");
                    });
                }
            });


            
        }

        document.querySelector(".small-nav button").addEventListener('click', () => {
            window.location.href = "./login.html?login=true";
        })

        document.querySelector("header button").addEventListener('click', () => {
            window.location.href = "./login.html?login=false";
        })

        document.querySelector("footer button").addEventListener('click', () => {
            window.location.href = "./login.html?login=false";
        })

    }
})


