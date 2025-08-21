import { auth, db } from "../../JS/firebase.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, getDocs, query, where, 
    deleteDoc, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// functioning part

// checking authorization

onAuthStateChanged(auth, async (user) => {
    try {
        if (user) {
            
            let q = query(collection(db, "admin"), where("uid", "==", user.uid));
            let querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                window.location.href = "../dashboard.html";
            } else {

                document.querySelector(".loader").classList.add('hide');
                document.querySelector(".data").classList.remove('hide');
                document.querySelector(".small-nav").classList.remove('hide');
                document.querySelector(".big-nav").classList.remove('hide');
                setPaddingForMain();
                loadUserDetails();

            }
        } else {
            window.location.href = "../index.html";
        }

    } catch (error) {
        alert(error.message);
    }
})



document.querySelector(".search button").addEventListener('click', async () => {
    let input = document.querySelector(".search input");
    if (input.value == ">update") {
        input.value = "";
        updateUserCurrentPoints();
    } else { 
        loadUserDetails();
    }
    
})

// signOut function

let logoutBtn = document.querySelector("#logout");
let sLogoutBtn = document.querySelector("#s-logout");
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "../../index.html"; // Redirect to login page
    }).catch((error) => {
        alert("Error logging out: " + error.message);
    });
});

sLogoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "../../index.html"; // Redirect to login page
    }).catch((error) => {
        alert("Error logging out: " + error.message);
    });
});




// function to update users point 
async function updateUserCurrentPoints() {
    let querySnapshot = await getDocs(collection(db, "users"));
    

    querySnapshot.forEach(async (data) => {
        let uid = data.data().uid;
        let currentPoints = data.data().currentPoints;

        querySnapshot = await getDocs(collection(db, "pointsToAdd"), where("uid", "==", uid));
        let morePoints;
        
        querySnapshot.forEach((doc) => {
            morePoints = doc.data().pointsAdded;
        })


        await updateDoc(doc(db, "users", uid), {
            currentPoints: currentPoints+morePoints
        })

        await updateDoc(doc(db, "pointsToAdd", uid), {
            pointsAdded: 0
        });

    })
    
}
// function to load details

async function loadUserDetails() {
    try{
        try {
            // deleting the element added when search is clicked without any input
            document.querySelector("#del").remove();
        } catch {
            // Added try block for any errors 
        }
        
        // handeling search
        let searchInput = document.querySelector('.search input')
        let searchQuery = searchInput.value;
        let searchParam = document.querySelector('.search select').value;

        if (searchParam == 'all') {
            // getting all the data if all is selected from the dropdown
            let querySnapshot = await getDocs(collection(db, 'users'));

            
            usersBody.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const userData = doc.data();

                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${userData.firstName} ${userData.lastName}</td>
                    <td>${userData.phone}</td>
                    <td>${userData.currentPoints}</td>
                    <td><button class="edit-btn" data-uid="${userData.uid}">Edit</button></td>
                `;
            
                usersBody.appendChild(row);
            });
        } else {

            // if search query is empty then showing a text "Please enter a search query"
            // This is getting removed if present when the search button is pressed again
            if (searchQuery === '') {
                let error = document.createElement('p');
                error.id = "del"
                error.style.textAlign = "center";
                error.innerText = 'Please enter a search query';
                document.querySelector('#usersTable').insertAdjacentElement('beforebegin', error);
                return;
            }

            // Collecting data according to search
            
            let q = query(collection(db, "users"), where(searchParam, "==", searchQuery));
            let querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                let error = document.createElement('p');
                error.id = "del"
                error.style.textAlign = "center";
                error.innerHTML = `No result found for <b>${searchQuery}</b> in ${searchParam}`;
                document.querySelector('#usersTable').insertAdjacentElement('beforebegin', error);
            } else {

                usersBody.innerHTML = '';
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
    
                    const row = document.createElement('tr');
    
                    row.innerHTML = `
                        <td>${userData.firstName} ${userData.lastName}</td>
                        <td>${userData.phone}</td>
                        <td>${userData.currentPoints}</td>
                        <td><button class="edit-btn" data-uid="${userData.uid}">Edit</button></td>
                    `;
                
                    usersBody.appendChild(row);
                });
            }
        }
        searchInput.value = '';
        giveFunctionToEditBtn();
    } catch (error) {
        alert(error.message);
    }
}

function giveFunctionToEditBtn() {
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const uid = e.target.dataset.uid;
            sessionStorage.setItem("selectedUID", uid);
            window.location.href = "billing.html";
        });
    });
}







//Designing part

function setPaddingForMain() {
    if (window.screen.width >= 768) {
        // making the gap b/w header and main section
        let main = document.querySelector("main");
        let mainPaddingTop = document.querySelector(".big-nav").offsetHeight;
        main.style.paddingTop = mainPaddingTop + "px";
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
}

setPaddingForMain();
