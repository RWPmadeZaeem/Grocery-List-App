
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js';

const appSettings = {
    databaseURL : 'https://fir-app-4ad00-default-rtdb.asia-southeast1.firebasedatabase.app/'
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingList');


const inputFieldEl= document.getElementById("input-field");
const shoppingListEl = document.getElementById("shopping-list");
const addButtonEl= document.getElementById("add-button");


addButtonEl.addEventListener("click",function(){
    let inputValue = inputFieldEl.value;

    push(shoppingListInDB, inputValue);
    
    inputFieldEl.value = "";
    console.log(inputValue);
    
})

onValue(shoppingListInDB, function(snapshot) {
    let itemsArray = Object.entries(snapshot.val());
    shoppingListEl.innerHTML = ""; // Clear the list before re-populating

    for (let [key, value] of itemsArray) {
        // Create a new list item element and set its text content
        let listItem = document.createElement("li");
        listItem.textContent = value;

        // Add a click event listener to delete the item on click
        listItem.addEventListener("click", function() {
            // Log to check if the click event is being triggered
            console.log(`Clicked item: ${key}`);

            // Remove the item from the database
            const itemRef = ref(database, `shoppingList/${key}`);
            remove(itemRef)
                .then(() => {
                    console.log(`Item removed from database: ${key}`);
                })
                .catch(error => {
                    console.error(`Error removing item from database: ${error}`);
                });

            // Remove the item from the list visually
            shoppingListEl.removeChild(listItem);
        });

        // Append the list item element to the shopping list
        shoppingListEl.appendChild(listItem);
    }
});
