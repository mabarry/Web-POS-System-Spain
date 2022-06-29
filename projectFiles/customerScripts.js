var isAccessible = false;


// Complete
function accessibleSwitch() {
    if(isAccessible == false) {
        document.getElementById("style").href = "customerStyleAccessible.css";
        isAccessible = true;
    }
    else {
        document.getElementById("style").href = "customerStyle.css";
        isAccessible = false;
    }
}


// Complete
function clearBoxes() {
    document.getElementById("idSearch").value = "";
    document.getElementById("quantitySearch").value = "";
}


// Complete
function searchFunction(x) {
    document.getElementById(x).focus();
}


// Complete
function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateOrderPrice();
}


// Complete
async function addOrderRow() {
    var name;
    var unitPrice;
    var salePrice;
    var id = document.getElementById('idSearch').value; 
    var custQty = parseFloat(document.getElementById('quantitySearch').value).toFixed(2);
    var invQty;

    // Do nto query the database if a field is empty
    if (id == null || custQty == null || isNaN(id) || isNaN(custQty) || id == undefined || custQty == undefined) {
        // TODO: Add feedback
        console.log("A field is empty");
        return;
    }

    // Query the foodItems database for the specific foodID entered
    const response = await fetch('/foodItems?foodid=' + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    // Get the needed data from the database query
    name = data.foodname;
    invQty = data.foodquantity;
    unitPrice = data.unitprice;

    salePrice = custQty * unitPrice;
    salePrice = salePrice.toFixed(2);

    // Do not add a row if there is not enough quantity
    if (custQty > invQty) {
        // TODO: Add feedback
        console.log("Not enough food in inventory");
        return;
    }

    // Check to see if this food item already has a sale line associated with it in this order
    var table = document.getElementById("orders")
    for (var i = 0; i < table.rows.length; i++) {
        var cols = table.rows.item(i).cells;
        saleFoodID = cols.item(1).innerHTML;

        // If it does, update the old sale line instead of creating a new one
        if (saleFoodID == id) {
            // Update the sale line values
            var newSalePrice = (parseFloat(cols.item(2).innerHTML) + parseFloat(salePrice)).toFixed(2);
            var newQty = (parseFloat(cols.item(3).innerHTML) + parseFloat(custQty)).toFixed(2);

            // Do not add more to the sale if there is not enough quantity
            if (newQty > invQty) {
                // TODO: Add feedback
                console.log("Not enough food in inventory");
                return;
            }
            
            cols.item(2).innerHTML = newSalePrice
            cols.item(3).innerHTML = newQty;

            //Clearing text boxes containing food ID and quantity
            clearBoxes();
            updateOrderPrice();
            return;
        }
    }

    // If this is a new food item, create the new row in HTML
    var tr = document.createElement('tr');

    // Create all columns
    rowText = ' \
    <td>' + name + '</td> \
    <td>' + id + '</td> \
    <td>' + salePrice + '</td> \
    <td>' + custQty + '</td> \
    <td><button type="button" class="btn btn-outline-danger" onclick="deleteRow(this)">X</button></td> \
    ';

    tr.innerHTML = rowText;
    table.appendChild(tr);

    //Clearing text boxes containing food ID and quantity
    clearBoxes();
    updateOrderPrice();
}


// In Progress
async function completeCustomerOrder() {
    var table = document.getElementById("orders");

    // TODO: 
    // Get the latest customerOrderID and saleLineID
    // 
    // Get the current date
    // Get the order total from the sale line total
    // Get the payment info for the order
    // Get the employeeID currently logged in
    //
    // Add the order to the CustomerOrder DB
    //
    // For each sale line in the table, 
    //     Add the sale line to the CustomerSaleLine DB
    //     Update the inventory in FoodItems DB
    //
    // Update the cheatsheet and database

    // Clear the HTML order table
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }
    updateOrderPrice();
}


/*
function completeCustomerOrder() {
    var table = document.getElementById("orders");
    var customerOrderID;
    var saleLineID;
    
    // Get the latest customerOrderID
    var promise = new Promise( function(resolve, reject) {
        // Query the database to get the food item info
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.responseType = "json";
        xmlHttp.open("GET", "http://localhost:3000/customerSaleLine");
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
            //Getting next available customerOrderID and saleLineID
            customerOrderID = (data[-1].customerorderid) + 1;
            saleLineID = (data[-1].salelineid) + 1;

            
            // Get the current date
            var customerOrderDate = new Date();
            var day = String(customerOrderDate.getDate()).padStart(2, '0');
            var month = String(customerOrderDate.getMonth() + 1).padStart(2, '0');
            var year = today.getFullYear();
            customerOrderDate = year + '-' + month + '-' + day;

            // Get order info from the website
            var customerOrderTotal = float(document.getElementById("price").innerHTML);
            var paymentMethod = "cash";
            var employeeID = "104";

            // Create customer order JSON object
            var newOrder = {
                "customerorderid": customerOrderID,
                "customerorderdate": customerOrderDate,
                "customerordertotal": customerOrderTotal,
                "paymentmethod": paymentMethod,
                "employeeid": employeeID
            }
            //item[COLUMN] = data;
            
            // Send the request
            var xmlHttpSend = new XMLHttpRequest();
            xmlHttpSend.responseType = "json";
            xmlHttpSend.open("POST", "http://localhost:3000/addCustomerOrder");
            xmlHttpSend.send(JSON.stringify(newOrder));


            // TODO: 
            // For each sale line in the table, 
            //     Add the sale line to the CustomerSaleLine DB
            //     Update the inventory in FoodItems DB
            //     Sum up the total order cost
            
            // Update the cheatsheet
            
            // Clear the HTML order table
            var tableLen = table.rows.length;
            for (var i = 1; i < tableLen; i++) {
                table.deleteRow(1);
            }
            updateOrderPrice();
        },

        function(error) {
            console.log(error);
        }
    );
}
*/


// Complete
function cancelOrder() {
    // Clear the HTML order table
    // Do not need to interact with DB since changes are only made when an order is completed
    var table = document.getElementById("orders");
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }
    updateOrderPrice();
}


// Complete
async function updateInfoBar() {
    var name;
    var unitPrice;
    var invQty;
    var id = parseInt(document.getElementById('idSearch').value); 

    // Do not attempt to read data if ID is invald
    if (isNaN(id)) {
        return;
    }

    // Query the foodItems database for the specific foodID entered
    const response = await fetch('/foodItems?foodid=' + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    // Get the food info
    name = data.foodname;
    invQty = data.foodquantity;
    unitPrice = data.unitprice;
    
    // Format food info into HTML
    document.getElementById("itemInfoField").innerHTML = name + "<br>Unit Price = " + unitPrice + "&nbsp;&nbsp;&nbsp;&nbsp;Quantity = " + invQty;
}

// Complete
async function createCheatSheet() {
    var id;
    var name;
    var unitPrice;
    var invQty;
    var storage;

    // Query the entire foodItems database
    const response = await fetch('/foodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();


    // Add each food item to the cheat sheet table
    var table = document.getElementById("sheet");

    for (var i = 0; i < data.length; i++) {
        // Create the new row
        var tr = document.createElement('tr');

        id = data[i].foodid;
        name = data[i].foodname;
        unitPrice = data[i].unitprice.toFixed(2);
        invQty = data[i].foodquantity.toFixed(2);
        storage = data[i].storagetype;

        // Create all columns and fill them with data
        rowText = ' \
        <td>' + id + '</td> \
        <td>' + name + '</td> \
        <td>€&nbsp;' + unitPrice + '</td> \
        <td>' + invQty + '</td> \
        <td>' + storage + '</td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }
}


// Complete
function updateOrderPrice() {
    var table = document.getElementById("orders");

    var totalCost = "0.00";
    for (var i = 1; i < table.rows.length; i++) {
        var cols = table.rows.item(i).cells;
        totalCost = parseFloat(totalCost) + parseFloat(cols.item(2).innerHTML);
        totalCost = parseFloat(totalCost).toFixed(2);
    }

    document.getElementById("price").innerHTML = totalCost;
}

async function createItemTable() {
    var id;
    var name;
    var unitPrice;
    var invQty;
    var storage;

    // Query the entire foodItems database
    const response = await fetch('/foodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();


    // Add each food item to the cheat sheet table
    var table = document.getElementById("items");

    for (var i = 0; i < data.length; i++) {
        // Create the new row
        var tr = document.createElement('tr');

        id = data[i].foodid;
        name = data[i].foodname;
        unitPrice = data[i].unitprice.toFixed(2);
        invQty = data[i].foodquantity.toFixed(2);
        storage = data[i].storagetype;

        // Create all columns and fill them with data
        rowText = ' \
        <td>' + id + '</td> \
        <td>' + name + '</td> \
        <td>€&nbsp;' + unitPrice + '</td> \
        <td>' + invQty + '</td> \
        <td>' + storage + '</td> \
        <td><button type="button" class="btn btn-primary" onclick="">Edit</button></td> \
        <td><button type="button" class="btn btn-outline-danger" onclick="">X</button></td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }
}

