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
