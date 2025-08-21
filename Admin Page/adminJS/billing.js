import { auth, db } from "../../JS/firebase.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, getDocs, query, where,
    setDoc, doc, serverTimestamp, 
    updateDoc
 } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';



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

// Adding payment mode at last of the bill sheet

if (window.screen.width >= 768) {
    let paymentMode = document.createElement("tr");
    paymentMode.innerHTML = `<td colspan="2"><input type="number" id="cashPaid" placeholder="Amount in cash"></td>
                        <td colspan="1"><input type="number" id="pointsUsed" placeholder="Amount in points"></td>
                        <td><button id="complete-purchase">Done</button></td>`

    document.querySelector("tfoot").insertAdjacentElement("beforeend", paymentMode);
} else {
    let tableFoot = document.querySelector("tfoot");
    
    tableFoot.innerHTML = tableFoot.innerHTML + `<tr> 
                                                    <td colspan="2"><input type="number" id="cashPaid" placeholder="Cash"></td>
                                                    <td colspan="2"><input type="number" id="pointsUsed" placeholder="Points"></td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4"><button id="complete-purchase">Done</button></td>
                                                </tr>`

    
}

setPaddingForMain();









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
                
                // adding and removing hidden from required elemets
                document.querySelector(".loader").classList.add('hide'); // hide loader
                document.querySelector(".data").classList.remove('hide');

                fetchDetails();
                setPaddingForMain();

            }
        } else {
            window.location.href = "../index.html";
        }

    } catch (error) {
        console.log(error.message);
    }
})

// adding back button function
document.querySelector('.back-btn-svg').addEventListener('click', () => {
    window.location.href = "./unauthorized.html"
})

// adding done button function
document.querySelector("#complete-purchase").addEventListener('click', () => {
    addTOBillingDB();
})


// adding purchased items on add button click
document.querySelector(".item-input button").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent form submit if inside a form

    // Get input values
    let itemName = document.querySelector("#item").value.trim();
    const cost = parseFloat(document.querySelector("#cost").value);
    const type = document.querySelector("#item-type").value;
    const itemNumber = document.querySelector("#item-number").value || 1;

    if (isNaN(cost) || cost < 0) {
        alert("Please enter valid item name and cost.");
        return;
    }

    // Create new row
    const newRow = document.createElement("tr");

    if (!itemName) {
        newRow.innerHTML = `
            <td class="item-name">Other Items </td>
            <td class="money">${cost}</td>
            <td class="item-type">${type}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;
    } else {
        newRow.innerHTML = `
            <td class="item-name">${itemName+ " x " +itemNumber}</td>
            <td class="money">${cost*itemNumber}</td>
            <td class="item-type">${type}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;
    }
        

    document.querySelector("#item-list").appendChild(newRow);

    // Reset form fields
    document.getElementById("item").value = "";
    document.getElementById("cost").value = "";
    document.querySelector("#item-number").value = "";

    // Update total
    updateTotal();
});

// Event delegation for delete button
document.querySelector(".items tbody").addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        e.target.closest("tr").remove();
        updateTotal();
    }
});

// Function to update total
function updateTotal() {
    const costs = document.querySelectorAll(".items .money");
    let total = 0;

    costs.forEach(cell => {
        total += parseFloat(cell.textContent) || 0;
    });

    document.querySelector("#total-cost").innerHTML = `₹${total}`;
}


async function fetchDetails() {
    try {
        const name = document.querySelector("#name");
        const phone = document.querySelector("#phone");
        const joiningDate = document.querySelector("#joining-date");
        const points = document.querySelector("#points")

        //gettig uid for data fetching purpose
        const uid = sessionStorage.getItem("selectedUID");

        if (!uid) {
            alert("No user selected. Redirecting to dashboard.");
            window.location.href = "./unauthorized.html";
        }
        console.log();
        let q = query(collection(db, "users"), where("uid", "==", uid));
        let querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            //come here
            let userData = doc.data()
            name.innerHTML = `<b>Customer Name:</b> ${userData.firstName +" "+ userData.lastName}`;
            phone.innerHTML = `<b>Phone:</b> ${userData.phone}`;
            points.innerHTML = `<b>Points:</b> ${userData.currentPoints}`
            joiningDate.innerHTML = `<b>Joining Date:</b> ${userData.createdAt.toDate().toLocaleString('en-GB', {
                                                                                            day: 'numeric',
                                                                                            month: 'long',
                                                                                            year: 'numeric'
                                                                                        })}`;
        })

    } catch (error) {
        alert(error);
    }
}



// adding data to billing DB
async function addTOBillingDB() {

    // code here
    try {
        
        document.querySelector(".loader").classList.remove("hide");
        document.querySelector(".data").classList.add("hide");
        const uid = sessionStorage.getItem("selectedUID");

        if (!uid) {
            alert("No user selected. Redirecting to dashboard.");
            window.location.href = "./unauthorized.html";
        }
        let data = await getDocs(collection(db, "users"), where("uid", "==",  uid));

        // getting total bills a user have and current points from backend
        let billsCount;
        let currentPoints;
        let earnedPoints;
        let usedPoints;
        data.forEach((doc) => {
            billsCount = doc.data().billsCount;
            currentPoints = doc.data().currentPoints;
            earnedPoints = doc.data().earnedPoints;
            usedPoints = doc.data().usedPoints;
        })

        // Value of points being used at the time of billing
        let pointsUsed = parseFloat(document.querySelector("#pointsUsed").value) || 0;
        if (pointsUsed > currentPoints) {
            alert(`The user have only ${currentPoints} points`);
            document.querySelector(".loader").classList.add("hide");
            document.querySelector(".data").classList.remove("hide");
            return;
        }
        
        // cash paid by the user and totalCost
        let cashPaid = parseFloat(document.querySelector('#cashPaid').value);
        let totalCost = parseFloat(document.querySelector("#total-cost").textContent.slice(1));
        if (totalCost != (pointsUsed+cashPaid)) {
            alert("Total paid amount is not equal to actual amount");
            document.querySelector(".loader").classList.add("hide");
            document.querySelector(".data").classList.remove("hide");
            return;
        } 
        
        // array to store items purchased
        let items = []; 
        let itemData = document.querySelectorAll("#item-list tr");

        let applicableCost = 0
        // creating the items list
        for (let i=0; i<itemData.length; i++) {
            let nameOfItem = itemData[i].querySelector(".item-name").innerText.split("x")[0].trim();
            let typeOfItem = itemData[i].querySelector(".item-type").innerText;
            let amount = itemData[i].querySelector(".money").innerText;
            
            let numberOfItem;
            try {
                numberOfItem = itemData[i].querySelector(".item-name").innerText.split("x")[1].trim();
            } catch {
                numberOfItem = "NA"
            }
            
            items.push({
                itemName: nameOfItem,
                itemType: typeOfItem,
                quantity: parseFloat(numberOfItem),
                unitCost: parseFloat(amount/numberOfItem),
                amount: amount
            });

            if (typeOfItem != "ice-cream") {
                applicableCost += amount;
            }
        }

        // removing all the fields after data is processed
        document.querySelector('#item-list').innerHTML = "";
        document.querySelector('#cashPaid').value = "";
        document.querySelector("#pointsUsed").value;


        let pointsToAdd
        if (applicableCost > 100 && pointsUsed == 0) {
            pointsToAdd = applicableCost*0.05;
        } else {
            pointsToAdd = 0;
        }

        // Pushing bill data to backend
        await setDoc(doc(db, "users", uid, "purchases", `bill_${billsCount + 1}`), {
            createdAt: serverTimestamp(),
            lastModified: serverTimestamp(),
            items: items,                                                                
            Amount: totalCost,
            pointsUsed: pointsUsed,
            cashPaid: cashPaid,
            pointsAdded: pointsToAdd,
        })

        // Reducing points in the user side.
        await updateDoc(doc(db, "users", uid), {
            currentPoints: currentPoints-pointsUsed,
            usedPoints: usedPoints+pointsUsed,
            earnedPoints: earnedPoints+(pointsToAdd)
        });
        

        // adding everydays points in the database to update the points next day
        let pointsAdded;
        try {
            let pointsAddedInDB = await getDocs(collection(db, "pointsToAdd"), where("uid", "==", uid));
            if (pointsAddedInDB.empty) {
                pointsAdded = 0;
            } else {
                pointsAddedInDB.forEach((doc) => {
                    pointsAdded = doc.data().pointsAdded;
                })
            }
            
        } catch (err) {
            console.log(err);
        }
        
        // Add points of current date to the database
        await setDoc(doc(db, "pointsToAdd", uid), {
            pointsAdded: pointsAdded + (pointsToAdd),
            uid: uid
        })

        // increasing bills count by 1
        await updateDoc(doc(db, "users", uid), {
            billsCount: billsCount+1
        })

        document.querySelector(".loader").classList.add("hide");
        document.querySelector(".data").classList.remove("hide");

        alert("Billing Complete");
        window.location.href = "./unauthorized.html"
        


    } catch (error) {
        console.log(error);

        document.querySelector(".loader").classList.add("hide");
        document.querySelector(".data").classList.remove("hide");
    }
}
