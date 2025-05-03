import {auth, db} from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.querySelector(".loader").classList.add('hide');
document.querySelector(".data").classList.remove('hide');


let loginForm = document.querySelector('.login');
let signupForm = document.querySelector('.signup');
let inputFields = document.querySelectorAll("input");
let errorMsg = document.querySelectorAll('.error-msg');


// showing login screen if user has entered by clicking Login/signup
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let login = urlParams.get('login')
if (login == 'true') {
    showLogin();
}

async function authSignup() {
    errorMsg[1].textContent = ''
    let firstName = document.querySelector('#first-name').value;
    let lastName = document.querySelector('#last-name').value;
    let age = document.querySelector('#age').value;

    if (firstName === '' || lastName === '') {
        errorMsg[1].textContent = 'Please fill all the fields';
        errorMsg[1].style.color = 'orange';
        return;
    } else if (isNaN(age) || age <= 0 || age > 120) {
        errorMsg[1].textContent = 'Enter a valid age';
        errorMsg[1].style.color = 'orange';
        return;
    } else {
        let form2 = document.querySelector('.form2-signup');
        let form1 = document.querySelector('.form1-signup');
        form1.classList.toggle('hide');
        form2.classList.toggle('hide');
        
        document.querySelector("#signup-complete-btn").addEventListener('click', async () => {
            errorMsg[2].textContent = ''

            let email = document.querySelector('#email').value;
            let phone = document.querySelector('#phone').value;
            let password = document.querySelector('#signupPass').value;
            let confirmPassword = document.querySelector('#confirmPass').value;
            let terms = document.querySelector('#terms').checked;

            if (phone === '' || email === '' || password === '' || confirmPassword === '') {
                errorMsg[2].textContent = 'Please fill all the fields';
                errorMsg[2].style.color = 'orange';
                return;
            } else if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
                errorMsg[2].textContent = 'Please enter a valid email address';
                errorMsg[2].style.color = 'orange';
                return;
            } else if (isNaN(phone)) {
                errorMsg[2].textContent = 'Phone number must be a number';
                errorMsg[2].style.color = 'orange';
                return;
            } else if (phone.length != 10) {
                errorMsg[2].textContent = 'Phone number must be exactly 10 digits';
                errorMsg[2].style.color = 'orange';
                return;
            } else if (password !== confirmPassword) {
                errorMsg[2].textContent = 'Passwords do not match';
                errorMsg[2].style.color = 'orange';
                return;
            } else if (password.length < 8) { 
                errorMsg[2].textContent = 'Password must be at least 8 characters long';
                errorMsg[2].style.color = 'red';
                return;
            } else if (password.length > 20) {
                errorMsg[2].textContent = 'Password must be less than 20 characters long';
                errorMsg[2].style.color = 'red';
                return;
            } else if (!terms) {
                errorMsg[2].textContent = 'Please! accept Terms and Conditions';
                errorMsg[2].style.color = 'orange';
            } else {
                // Creating user after taking all the details from the user
                try {
                    let userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                    let user = userCredentials.user;
                    
                    await addDoc(collection(db, "users"), {
                        uid: user.uid,
                        firstName: firstName,
                        lastName: lastName,
                        age: age,
                        phone: phone,
                        email: email,
                        currentPoints: 0,
                        earnedPoints: 0,
                        usedPoints: 0,
                        createdAt: serverTimestamp(),
                        isTermsAccepted: terms
                    })

                    errorMsg[2].innerText = "User Created Successfully";
                    errorMsg[2].style.color = 'green';


                    setTimeout(() => {
                        window.location.href = "./dashboard.html"; // Redirect to dashboard
                    }, 2000); 

                } catch (error) {
                    
                    if (error.code === "auth/email-already-in-use") {
                        errorMsg[2].innerText = 'Account Already Exists!';
                        errorMsg[2].style.color = 'green';
                        setTimeout(() => {
                            showLogin();
                        }, 2000)
                    } else {
                        errorMsg[2].innerText = error.message;
                        errorMsg[2].style.color= 'red';
                    }
                }
            }
        });
    }
}


async function authLogin() {
    let identifier = document.querySelector("#login-email").value;
    let pass = document.querySelector("#login-pass").value;
    
    if (identifier === '' || pass === '') {
        errorMsg[0].innerText = 'All fields are required';
        errorMsg[0].style.color = 'orange';
        return;
    }


    try {
        let email = identifier
        let userCredential = await signInWithEmailAndPassword(auth, email, pass);
        errorMsg[0].innerText = 'Login Success'
        errorMsg[0].style.color = 'green'
        setTimeout(() => {
            window.location.href = './dashboard.html'
        }, 2000)

    } catch (error) {
        if (error.message == "Firebase: Error (auth/invalid-credential).") {
            errorMsg[0].innerText = 'Wrong Password!';
            errorMsg[0].style.color = 'red';
        } else if (error.message == "Firebase: Error (auth/network-request-failed).") {
            errorMsg[0].innerText = "";
            alert("Network Connection is poor.")
        } else if (error.message = "Firebase: Error (auth/invalid-email).") {
            errorMsg[0].innerText = 'Enter a valid email';
            errorMsg[0].style.color = 'red';
        } else {
            alert(error.message)
        }
    }
}


function showLogin() {
    clearFields();
    signupForm.classList.add('hide');
    loginForm.classList.remove('hide');
}

function clearFields() {
    // This function clears all the input fields and error messages in the login and signup forms
    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].value = '';
    }

    for (let i = 0; i < errorMsg.length; i++) {
        errorMsg[i].textContent = '';
    }
}

// Clearing all the fields when switching between login and signup forms
let loginFormBtn = document.querySelector('#old-account');
loginFormBtn.addEventListener('click', () => {
    clearFields();
    signupForm.classList.toggle('hide');
    loginForm.classList.toggle('hide');
})

let signupFormBtn = document.querySelector('#new-account');
signupFormBtn.addEventListener('click', () => {
    clearFields();
    loginForm.classList.toggle('hide');
    signupForm.classList.toggle('hide');
})




// In signup going to personal details page
let signupBtn = document.querySelector('#signup-btn');
signupBtn.addEventListener('click', () => {
    authSignup();
});


// Logging In
let loginBtn = document.querySelector("#login-btn");
loginBtn.addEventListener('click', () => {
    authLogin();
});

