// const { copyDone } = require("pg-protocol/dist/messages");

var vendorSwitch = false;
var vendorSwitch = false;
var addEditItemSwitch = false;
var reportSwitch = false;
var previousStyle = "";


// Complete
function clearBoxes() {
    document.getElementById("idSearch").value = "";
    document.getElementById("quantitySearch").value = "";
    document.getElementById("vendorPriceSearch").value = "";
}


// Complete
function clearLoginBoxes() {
    document.getElementById("userNameInput").value = "";
    document.getElementById("passwordInput").value = "";
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
    var buyPrice;
    var id = document.getElementById('idSearch').value; 
    var vendorQty = parseFloat(document.getElementById('quantitySearch').value).toFixed(2);
    var invQty;

    // Do nto query the database if a field is empty
    if (id == null || vendorQty == null || isNaN(id) || isNaN(vendorQty) || id == undefined || vendorQty == undefined) {
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
    unitPrice = document.getElementById("vendorPriceSearch").value;

    buyPrice = vendorQty * unitPrice;
    buyPrice = buyPrice.toFixed(2);

    // Check to see if this food item already has a buy line associated with it in this order
    var table = document.getElementById("orders")
    for (var i = 0; i < table.rows.length; i++) {
        var cols = table.rows.item(i).cells;
        buyFoodID = cols.item(1).innerHTML;

        // Update the old buy line instead of creating a new one
        if (buyFoodID == id) {
            // Update the buy line values
            var newBuyPrice = (parseFloat(cols.item(2).innerHTML) + parseFloat(buyPrice)).toFixed(2);
            var newQty = (parseFloat(cols.item(3).innerHTML) + parseFloat(vendorQty)).toFixed(2);
            
            cols.item(2).innerHTML = newBuyPrice
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
    <td>' + buyPrice + '</td> \
    <td>' + vendorQty + '</td> \
    <td><button type="button" class="btn btn-outline-danger" onclick="deleteRow(this)">X</button></td> \
    ';

    tr.innerHTML = rowText;
    table.appendChild(tr);

    //Clearing text boxes containing food ID and quantity
    clearBoxes();
    updateOrderPrice();
}


// In-Progress
async function completeVendorOrder() { 
    // Get the next available vendorOrderID and buyLineID
    // Query to get the vendorBuyLine database
    const getResponse = await fetch('/vendorBuyLine', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const getData = await getResponse.json();

    var vendorOrderID = getData[getData.length - 1].vendororderid + 1;
    var buyLineID = getData[getData.length - 1].vendorlineid + 1;

    // Get all the necessary order info
    // Get the current date
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();
    var vendorOrderDate = year + '-' + month + '-' + day;

    // Get order info from the website
    var vendorOrderTotal = parseFloat(document.getElementById("price").innerHTML);
    
    var vendorName = document.getElementById("vendorNameSearch").value;

    // Query to get the current employee logged in
    const employeeResponse = await fetch('/currentEmployee', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    var employeeID = await employeeResponse;
    

    // Do not add empty order to the DB
    if (vendorOrderTotal <= 0) {
        // TODO: Add feedback
        console.log("No items in the order");
        return;
    }


    // Create vendor order JSON object
    const newOrder = {
        vendororderid: parseInt(vendorOrderID),
        vendorname: vendorName,
        vendororderdate: vendorOrderDate,
        vendorordertotal: parseFloat(vendorOrderTotal),
        employeeid: parseInt(employeeID)
    };

    // Add the order to the VendorOrder DB
    const orderPostResponse = await fetch('/addVendorOrder', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
    });
    

    // Add each buy line to the VendorBuyLine DB
    var orderTable = document.getElementById("orders");
    console.log(orderTable.rows);
    for (var i = 1; i < orderTable.rows.length; i++) {
        console.log(orderTable.rows[i]);
        // buyLineID declared above
        // vendorOrderID declared above
        var foodID = orderTable.rows[i].cells[1].innerHTML;
        var buyLinePrice = orderTable.rows[i].cells[2].innerHTML;
        var buyLineQuantity = orderTable.rows[i].cells[3].innerHTML;

        // Create buy line JSON object
        const newBuyLine = {
            vendorlineid: parseInt(buyLineID),
            vendororderid: parseInt(vendorOrderID),
            foodid: parseInt(foodID),
            vendorlineprice: parseFloat(buyLinePrice),
            vendorlinequantity: parseFloat(buyLineQuantity)
        };

        // Add the order to the VendorOrder DB
        const buyPostResponse = await fetch('/addBuyLine', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBuyLine)
        });
        buyLineID++;
    }

    // Update the vendorOrder database
    const vendorOrderResponse = await fetch('/updateVendorOrder', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }); 

    // Update the vendorBuyLine databases
    const vendorBuyLineResponse = await fetch('/updateVendorBuyLine', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }); 

    // Clear the HTML order table
    var orderTableLen = orderTable.rows.length;
    for (var i = 1; i < orderTableLen; i++) {
        orderTable.deleteRow(1);
    }
    updateOrderPrice();


    // Add vendor order to waiting table
    // If this is a new food item, create the new row in HTML
    var table = document.getElementById("prevOrders");

    var tr = document.createElement('tr');

    // Create all columns
    rowText = ' \
    <td>' + vendorName + '</td> \
    <td>' + vendorOrderID + '</td> \
    <td>' + vendorOrderDate + '</td> \
    <td>' + vendorOrderTotal.toFixed(2) + '</td> \
    <td><button type="button" class="btn btn-outline-primary" onclick="receiveVendorOrder(this)">Mark Received</button></td>';
    // data-bs-toggle="modal" data-bs-target="#receiveModal"

    tr.innerHTML = rowText;
    table.appendChild(tr);
}



// Receive vendor order
async function receiveVendorOrder(btn) {
    var row = btn.parentNode.parentNode;
    var vendorOrderID = row.cells[1].innerHTML;

    // Get all sale lines associated with the vendororderid
    const vendorOrderInfo = {
        vendororderid: vendorOrderID
    };

    // Query to get the customerSaleLine database
    const buyLineResponse = await fetch('/buyLinesFromOrder', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(vendorOrderInfo)
    });
    const buyLinesDB = await buyLineResponse.json();


    for (var i = 0; i < buyLinesDB.length; i++) {
        var foodID = buyLinesDB[i].foodid;

        // Find what the new quantity should be for each buy line
        var inventoryQuantity = document.getElementById("sheet").rows[foodID].cells[3].innerHTML;
        var buyLineQuantity = buyLinesDB[i].vendorlinequantity;

        var newQuantity = parseFloat(parseFloat(inventoryQuantity) + parseFloat(buyLineQuantity)).toFixed(2);
        console.log(inventoryQuantity);
        console.log(buyLineQuantity);
        console.log(newQuantity);

        
        const newFoodInv = {
            foodid: foodID,
            newquantity: newQuantity
        };

        // Edit the inventory in FoodItems DB
        const editFoodItemsResponse = await fetch('/editFoodQty', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFoodInv)
        });

        // Update the cheatsheet
        document.getElementById("sheet").rows[foodID].cells[3].innerHTML = newQuantity;
    }

    // Delete the vendor order from the waiting table
    row.parentNode.removeChild(row);
        
    // Update the foodItems DB
    const foodItemsResponse = await fetch('/updateFoodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }); 
}


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


// Complete
window.addEventListener('load', (event) => {
    // console.log(window.name);
    if (window.name == "accessibilityMode") {
        // figure out current page
        // set corresponding css file
        // console.log(document.getElementById("style").href);

        if (document.getElementById("style").href == "http://localhost:3000/vendorStyle.css") {
            document.getElementById("style").href = "vendorStyleAccessible.css";
            window.name = "accessibilityMode";
            vendorSwitch = true;

        } else if (document.getElementById("style").href == "http://localhost:3000/vendorStyle.css") {
            document.getElementById("style").href = "vendorStyleAccessible.css";
            window.name = "accessibilityMode";
            vendorSwitch = true;

        } else if (document.getElementById("style").href == "http://localhost:3000/addEditItemStyle.css") {
            document.getElementById("style").href = "addEditItemStyleAccessible.css";
            window.name = "accessibilityMode";
            addEditItemSwitch = true;

        } else if (document.getElementById("style").href == "http://localhost:3000/reportStyle.css") {
            document.getElementById("style").href = "reportStyleAccessible.css";
            window.name = "accessibilityMode";
            reportSwitch = true;

        }
    }
});