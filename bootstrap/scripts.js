var isAccessible = false;

function clearBoxes() {
    document.getElementById("foodID").value = "";
    document.getElementById("foodQuantity").value = "";
}

function searchFunction(x, y) {
    document.getElementById(x).blur();
    document.getElementById(y).focus();
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


function addRow() {
    var name;
    var price;
    var id = document.getElementById('idForm').value; 
    var custQty = document.getElementById('quantityForm').value;
    var invQty;

    var canGo = false;

    // Do nto query the database if a field is empty
    if (id == undefined || custQty == undefined) {
        // Empty field
        // TODO: Add feedback
        return;
    }

    // Query the database to get the food name, unit price, and quantity in inventory
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "json";
    xmlHttp.open("GET", "http://localhost:3000/foodItems");
    xmlHttp.onload = function() {
        name = xmlHttp.response[id - 1].foodname;
        invQty = xmlHttp.response[id - 1].foodquantity;
        price = xmlHttp.response[id - 1].unitprice;
    }
    xmlHttp.send();

    setTimeout(() => {  
        console.log("ID = " + id + "\nName = " + name +"\nQty = " + custQty + "\nPrice = " + price);
        
        // Do not add a row if there is not enough quantity
        if (custQty > invQty) {
            // Not enough in inventory
            // TODO: Add feedback
            return;
        }
        
        // Create the new row in HTML
        var tr = document.createElement('tr');

        // Create all columns
        rowText = ' \
        <td>' + name + '</td> \
        <td>' + price + '</td> \
        <td>' + custQty + '</td> \
        <td><button type="button" class="btn btn-outline-danger" onclick="deleteRow(this)">X</button></td> \
        ';

        tr.innerHTML = rowText;
        var table = document.getElementById("orders")
        table.appendChild(tr);

        //Clearing text boxes containing food ID and quantity
        // TODO: Fix clearBoxes()
        //clearBoxes();
    }, 1000);
}


function completeOrder() {
    var table = document.getElementById("orders");

    // Get the payment info for the order
    // ...

    /*
    If there was connectivity to the database, this is where we would update the final order info
    */

    // Delete all rows
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }
}
