var isAccessible = false;

// DISCUSS: Have a variable that stores the json object for each DB and have an update function for each DB??

function clearBoxes() {
    document.getElementById("foodID").value = "";
    document.getElementById("foodQuantity").value = "";
}

function searchFunction(x) {
    document.getElementById(x).focus();
}


function accessibleSwitch() {
    if(isAccessible == false) {
        document.getElementById("style").href = "style_accessible.css";
        isAccessible = true;
    }
    else {
        document.getElementById("style").href = "style.css";
        isAccessible = false;
    }
}


function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}


function addOrderRow() {
    var name;
    var unitPrice;
    var salePrice;
    var id = document.getElementById('idForm').value; 
    var custQty = document.getElementById('quantityForm').value;
    var invQty;

    // Do nto query the database if a field is empty
    if (id == undefined || custQty == undefined) {
        // TODO: Add feedback
        console.log("A field is empty");
        return;
    }

    // Use a promise to prevent the function from running before all data is recieved
    var promise = new Promise( function(resolve, reject) {
        // Query the database to get the food item info
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.responseType = "json";
        xmlHttp.open("GET", "http://localhost:3000/foodItems");
        xmlHttp.onload = function() {
            // Status of the request is OK
            if (xmlHttp.status == 200) {
                resolve(xmlHttp.response);
            }
            // Request status not OK
            else {
                reject(Error(xmlHttp.statusText));
            }

            // Error with http request
            xmlHttp.onerror = function() {
                reject(Error("Data could not be retrieved"))
            }
        }
        xmlHttp.send();
    });

    // Wait for the query to complete before working with the data
    promise.then( 
        function(data) {
            name = data[id - 1].foodname;
            invQty = data[id - 1].foodquantity;
            unitPrice = data[id - 1].unitprice;

            console.log("ID = " + id + "\nName = " + name +"\nQty = " + custQty + "\nUnit Price = " + unitPrice);
    
            // TODO: Update the sale line if its already in the table
            // See if id is in table
            // If yes,
            //     set custQty to tableQty + custQty
            //

            // Do not add a row if there is not enough quantity
            if (custQty > invQty) {
                // TODO: Add feedback
                console.log("Not enough food in inventory");
                return;
            }

            salePrice = custQty * unitPrice;
            salePrice = salePrice.toFixed(2);
            
            // Create the new row in HTML
            var tr = document.createElement('tr');

            // Create all columns
            rowText = ' \
            <td>' + name + '</td> \
            <td>€&nbsp;' + salePrice + '</td> \
            <td>' + custQty + '</td> \
            <td><button type="button" class="btn btn-outline-danger" onclick="deleteRow(this)">X</button></td> \
            ';

            tr.innerHTML = rowText;
            var table = document.getElementById("orders")
            table.appendChild(tr);

            //Clearing text boxes containing food ID and quantity
            // TODO: Fix clearBoxes()
            //clearBoxes();
        },

        function(error) {
            console.log(error);
        }
    );
}

// DISCUSS: How do we want to keep track of the 
function completeCustomerOrder() {
    var table = document.getElementById("orders");

    // TODO: 
    // Get the latest customerOrderID
    // Get the latest saleLineID
    //
    // For each sale line in the table, 
    //     Add the sale line to the CustomerSaleLine DB
    //     Update the inventory in FoodItems DB
    //     Sum up the total order cost
    //
    // Get the current date
    // Get the payment info for the order
    // Get the employeeID currently logged in
    //
    // Add the order to the CustomerOrder DB
    //
    // Update the cheatsheet

    // Clear the HTML order table
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }
}


function cancelOrder() {
    // Clear the HTML order table
    // Do not need to interact with DB since changes are only made when an order is completed
    var table = document.getElementById("orders");
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }
}


function updateInfoBar() {
    var name;
    var unitPrice;
    var invQty;

    // Get the current foodID
    var id = document.getElementById('idForm').value; 

    // Query the foodItems database
    // Use a promise to prevent the function from running before all data is recieved
    var promise = new Promise( function(resolve, reject) {
        // Query the database to get the food item info
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.responseType = "json";
        xmlHttp.open("GET", "http://localhost:3000/foodItems");
        xmlHttp.onload = function() {
            // Status of the request is OK
            if (xmlHttp.status == 200) {
                resolve(xmlHttp.response);
            }
            // Request status not OK
            else {
                reject(Error(xmlHttp.statusText));
            }

            // Error with http request
            xmlHttp.onerror = function() {
                reject(Error("Data could not be retrieved"))
            }
        }
        xmlHttp.send();
    });

    // Wait for the query to complete before working with the data
    promise.then( 
        function(data) {
            // Do not attempt to read data if ID is invald
            // TODO: Move this up depending on how database info is stored
            if (id < 1 || id > data.length) {
                console.log("Invalid ID input");
                return;
            }

            // Get the food info
            name = data[id - 1].foodname;
            invQty = data[id - 1].foodquantity;
            unitPrice = data[id - 1].unitprice;
            
            // Format food info into HTML
            document.getElementById("itemInfoField").innerHTML = name + "\nUnit Price = " + unitPrice + "\nQuantity = " + invQty;
        },

        function(error) {
            console.log(error);
        }
    );
}

createCheatSheet();
function createCheatSheet() {
    // Query the entire foodItems database
    // Use a promise to prevent the function from running before all data is recieved
    var promise = new Promise( function(resolve, reject) {
        // Query the database to get the food item info
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.responseType = "json";
        xmlHttp.open("GET", "http://localhost:3000/foodItems");
        xmlHttp.onload = function() {
            // Status of the request is OK
            if (xmlHttp.status == 200) {
                resolve(xmlHttp.response);
            }
            // Request status not OK
            else {
                reject(Error(xmlHttp.statusText));
            }

            // Error with http request
            xmlHttp.onerror = function() {
                reject(Error("Data could not be retrieved"))
            }
        }
        xmlHttp.send();
    });

    // Wait for the query to complete before working with the data
    promise.then( 
        function(data) {
            var table = document.getElementById("cheatsheet");

            // Add each food item to the cheat sheet
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
                
                var row = table.insertRow();

                var id = row.insertCell(0);
                var name = row.insertCell(1);
                var unitPrice = row.insertCell(2);
                var qty = row.insertCell(3);
                var location = row.insertCell(4);

                id.innerHTML = data[i].foodid;
                name.innerHTML = data[i].foodname;
                unitPrice.innerHTML = data[i].unitprice;
                qty.innerHTML = data[i].foodquantity;
                location.innerHTML = data[i].storagetype;
            }
        },

        function(error) {
            console.log(error);
        }
    );
}
