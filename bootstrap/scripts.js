var isAccessible = false;


function clearBoxes() {
    document.getElementById("idSearch").value = "";
    document.getElementById("quantitySearch").value = "";
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
    updateOrderPrice();
}


function addOrderRow() {
    var name;
    var unitPrice;
    var salePrice;
    var id = document.getElementById('idSearch').value; 
    var custQty = parseFloat(document.getElementById('quantitySearch').value);
    var invQty;

    // Do nto query the database if a field is empty
    console.log("NAN CHECK:: ID = " + id + "\nCust Qty = " + custQty);
    if (id == null || custQty == null || isNaN(id) || isNaN(custQty)) {
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

            salePrice = custQty * unitPrice;
            salePrice = salePrice.toFixed(2);
            custQty = custQty.toFixed(2);

            // Do not add a row if there is not enough quantity
            if (custQty > invQty) {
                // TODO: Add feedback
                console.log("Not enough food in inventory");
                return;
            }

            // Check to see if this food item is alread in the order
            // If it is, update the old sale line instead of creating a new one
            var table = document.getElementById("orders")
            for (var i = 0; i < table.rows.length; i++) {
                var cols = table.rows.item(i).cells;
                saleFoodID = cols.item(1).innerHTML;

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
        },

        function(error) {
            console.log(error);
        }
    );
}


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
        },

        function(error) {
            console.log(error);
        }
    );
    // TODO: 
    // For each sale line in the table, 
    //     Add the sale line to the CustomerSaleLine DB
    //     Update the inventory in FoodItems DB
    //     Sum up the total order cost
    
    var customerOrderTotal = float(document.getElementById("price").innerHTML);

    // Get the current date
    var customerOrderDate = new Date();
    var day = String(customerOrderDate.getDate()).padStart(2, '0');
    var month = String(customerOrderDate.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();
    customerOrderDate = year + '-' + month + '-' + day;

    // Get the payment info for the order
    var paymentMethod = "cash";

    // Get the employeeID currently logged in
    var employeeID = "104";

    // Add the order to the CustomerOrder DB
    //
    // Update the cheatsheet
    
    // Clear the HTML order table
    var tableLen = table.rows.length;
    for (var i = 1; i < tableLen; i++) {
        table.deleteRow(1);
    }
    updateOrderPrice();
}


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
            var id;
            var name;
            var unitPrice;
            var invQty;
            var storage;

            var table = document.getElementById("sheet");

            // Add each food item to the cheat sheet
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);

                var tr = document.createElement('tr');

                id = data[i].foodid;
                name = data[i].foodname;
                unitPrice = data[i].unitprice.toFixed(2);
                invQty = data[i].foodquantity.toFixed(2);
                storage = data[i].storagetype;

                // Create all columns
                rowText = ' \
                <td>' + id + '</td> \
                <td>' + name + '</td> \
                <td>€&nbsp;' + unitPrice + '</td> \
                <td>' + invQty + '</td> \
                <td>' + storage + '</td>';

                tr.innerHTML = rowText;
                table.appendChild(tr);
            }
        },

        function(error) {
            console.log(error);
        }
    );
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
