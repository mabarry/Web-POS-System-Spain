var customerSwitch = false;
var vendorSwitch = false;


function accessibleCustomer() {
    if(customerSwitch == false) {
        previousStyle =
        document.getElementById("style").href = "customerStyleAccessible.css";
        customerSwitch = true;
    }
    else {
        document.getElementById("style").href = "customerStyle.css";
        customerSwitch = false;
    }
}

function accessibleVendor() {
    if(vendorSwitch == false) {
        previousStyle =
        document.getElementById("style").href = "vendorStyleAccessible.css";
        vendorSwitch = true;
    }
    else {
        document.getElementById("style").href = "vendorStyle.css";
        vendorSwitch = false;
    }
}

function accessibleItems() {
    if(vendorSwitch == false) {
        previousStyle =
        document.getElementById("style").href = "addEditItemStyleAccessible.css";
        vendorSwitch = true;
    }
    else {
        document.getElementById("style").href = "addEditItemStyle.css";
        vendorSwitch = false;
    }
}

function accessibleReport() {
    if(vendorSwitch == false) {
        previousStyle =
        document.getElementById("style").href = "reportStyleAccessible.css";
        vendorSwitch = true;
    }
    else {
        document.getElementById("style").href = "reportStyle.css";
        vendorSwitch = false;
    }
}



function clearBoxes() {
    document.getElementById("idSearch").value = "";
    document.getElementById("quantitySearch").value = "";
}



function clearLoginBoxes() {
    document.getElementById("userNameInput").value = "";
    document.getElementById("passwordInput").value = "";
}



function searchFunction(x) {
    document.getElementById(x).focus();
}



function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateOrderPrice();
}



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

            // Do not add more to the sale if there is not enough quantity o
            if (newQty > invQty || newQty < 0) {
                // TODO: Add feedback
                console.log("Invalid quantity input");
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
    
    // Do not add a row if there is not enough quantity
    if (custQty > invQty || custQty < 0) {
        // TODO: Add feedback
        console.log("Invalid quantity input");
        return;
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



async function checkPassword() {

    // Query the database to get the employee table
    var employeeid = document.getElementById("userNameInput").value;
    var enteredPassword = document.getElementById("passwordInput").value;

    const employeeInformation = {
        employeeID: parseInt(employeeid)
    }
    
    // Query the employeeList for a specific employeeid
    const response = await fetch('/employeeList?employeeid=' + employeeid, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeInformation)
    });
    const data = await response.json();

    var storedPassword = data.password;
    
    if(enteredPassword === storedPassword) {
        document.getElementById("loginButton").href = "customer.html";
        document.getElementById("loginCheck").innerHTML = "";
    }
    else {
        clearLoginBoxes();
        document.getElementById("loginCheck").innerHTML = "Incorrect Username/Password.";

    }
}



async function completeCustomerOrder() { 
    // Get the next available customerOrderID and saleLineID
    // Query to get the customerSaleLine database
    const getResponse = await fetch('/customerSaleLine', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const getData = await getResponse.json();

    var customerOrderID = getData[getData.length - 1].customerorderid + 1;
    var saleLineID = getData[getData.length - 1].salelineid + 1;

    // Get all the necessary order info
    // Get the current date
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();
    var customerOrderDate = year + '-' + month + '-' + day;

    // Get order info from the website
    var customerOrderTotal = parseFloat(document.getElementById("price").innerHTML);
    
    var paymentMethod;
    if (document.getElementById('btnradio1').checked) {
        paymentMethod = "cash";
    }
    else {
        paymentMethod = "card"
    }

    // Query to get the current employee logged in
    const employeeResponse = await fetch('/currentEmployee', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    var employeeID = await employeeResponse.json();
    

    // Do not add empty order to the DB
    if (customerOrderTotal <= 0) {
        console.log("No items in the order");
        return;
    }


    // Create customer order JSON object
    const newOrder = {
        customerorderid: parseInt(customerOrderID),
        customerorderdate: customerOrderDate,
        customerordertotal: parseFloat(customerOrderTotal),
        paymentmethod: paymentMethod,
        employeeid: parseInt(employeeID)
    };

    // Add the order to the CustomerOrder DB
    const orderPostResponse = await fetch('/addCustomerOrder', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
    });
    

    // Add each sale line to the CustomerSaleLine DB
    var orderTable = document.getElementById("orders");
    console.log(orderTable.rows);
    for (var i = 1; i < orderTable.rows.length; i++) {
        console.log(orderTable.rows[i]);
        // saleLineID declared above
        // customerOrderID declared above
        var foodID = orderTable.rows[i].cells[1].innerHTML;
        var saleLinePrice = orderTable.rows[i].cells[2].innerHTML;
        var saleLineQuantity = orderTable.rows[i].cells[3].innerHTML;

        console.log();

        // Create sale line JSON object
        const newSaleLine = {
            salelineid: parseInt(saleLineID),
            customerorderid: parseInt(customerOrderID),
            foodid: parseInt(foodID),
            salelineprice: parseFloat(saleLinePrice),
            salelinequantity: parseFloat(saleLineQuantity)
        };

        // Add the order to the CustomerOrder DB
        const salePostResponse = await fetch('/addSaleLine', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSaleLine)
        });
        saleLineID++;

        // Find what the new quantity should be
        var inventoryQuantity = document.getElementById("sheet").rows[foodID].cells[3].innerHTML;
        var newQuantity = parseFloat(inventoryQuantity - saleLineQuantity).toFixed(2);
        console.log(inventoryQuantity);
        const newFoodInv = {
            foodid: foodID,
            newquantity: newQuantity
        };

        // Edit the inventory in FoodItems DB
        const editFoodItemsResponse = await fetch('/editFoodItems', {
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

    // Update the customerOrder database
    const customerOrderResponse = await fetch('/updateCustomerOrder', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }); 

    // Update the customerSaleLine databases
    const customerSaleLineResponse = await fetch('/updateCustomerSaleLine', {
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
    
    // Update the foodItems DB
    const foodItemsResponse = await fetch('/updateFoodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }); 
}



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


