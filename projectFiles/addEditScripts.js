async function addToFoodItems() {
    //TODO: Add error checking

    // Get next available foodID
    const foodResponse = await fetch('/foodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const foodItemsDB = await foodResponse.json();
    var foodID = foodItemsDB.length + 1;

    // Get all food info from input fields
    var name = document.getElementById("newName").value;
    var price = document.getElementById("newPrice").value;
    var qty = document.getElementById("newQuantity").value;
    var location = document.getElementById("newLocation").value;
    var packaging = document.getElementById("newPackaging").value;

    // Create JSON object
    const newFoodInfo = {
        foodid: parseInt(foodID),
        foodname: name,
        unitprice: parseFloat(price).toFixed(2),
        foodquantity: qty,
        storagetype: location,
        packaged: packaging
    }

    // Add new food object to database
    const addResponse = await fetch('/addFoodItem', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFoodInfo)
    });


    // Update the foodItems DB
    const foodItemsResponse = await fetch('/updateFoodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    // Update the cheat sheet
    var table = document.getElementById("items");
    var tr = document.createElement('tr');

    // Create all columns and fill them with data
    rowText = ' \
    <td>' + foodID + '</td> \
    <td>' + name + '</td> \
    <td>€&nbsp;' + parseFloat(price).toFixed(2) + '</td> \
    <td>' + qty + '</td> \
    <td>' + location + '</td> \
    <td>' + packaging + '</td> \
    <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editItemModal" onclick="autoFillPopUp(this)">Edit</button></td> \
    <td><button type="button" class="btn btn-outline-danger" onclick="deleteFoodItem(this)">X</button></td>';

    tr.innerHTML = rowText;
    console.log(rowText);
    table.appendChild(tr);

    // Clear all the boxes
    document.getElementById("newName").value = '';
    document.getElementById("newPrice").value = '';
    document.getElementById("newQuantity").value = '';
    document.getElementById("newLocation").value = '';
    document.getElementById("newPackaging").value = '';
}


async function createItemTable() {
    var id;
    var name;
    var unitPrice;
    var invQty;
    var storage;
    var packaged;

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
        packaged = data[i].packaged;

        // Create all columns and fill them with data
        rowText = ' \
        <td>' + id + '</td> \
        <td>' + name + '</td> \
        <td>€&nbsp;' + unitPrice + '</td> \
        <td>' + invQty + '</td> \
        <td>' + storage + '</td> \
        <td>' + packaged + '</td> \
        <td><button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editItemModal" onclick="autoFillPopUp(this)">Edit</button></td> \
        <td><button type="button" class="btn btn-outline-danger" onclick="deleteFoodItem(this)">X</button></td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }
}


async function deleteFoodItem(btn) {
    // Delete the food item from database
    var row = btn.parentNode.parentNode;
    var foodID = row.cells[0].innerHTML;

    const deleteFood = {
        foodid: foodID
    };
    console.log("About to delete");
    const deleteResponse = await fetch('/deleteFoodItem', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteFood)
    });
    var didSucceed = await deleteResponse.json();

    if (didSucceed == "-1") {
        console.log("Invalid delete, item has had previous orders");
        // TODO: Add feedback
        return;
    }

    console.log("About to remove row");
    // Remove the row from the items table
    row.parentNode.removeChild(row);

    console.log("About to update DB");
    // Update the food items DB
    const foodItemsResponse = await fetch('/updateFoodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    console.log("About to clear boxes");
    // Clear all the boxes
    document.getElementById("newName").value = '';
    document.getElementById("newPrice").value = '';
    document.getElementById("newLocation").value = '';
    document.getElementById("newPackaging").value = '';
}


function autoFillPopUp(btn) {
    // Get data from table row
    var row = btn.parentNode.parentNode;

    var id = row.cells[0].innerHTML;
    var name = row.cells[1].innerHTML;
    var price = row.cells[2].innerHTML.substring(7);
    var qty = row.cells[3].innerHTML;
    var location = row.cells[4].innerHTML;
    var packaged = row.cells[5].innerHTML;

    // Fill in pop-up fields
    document.getElementById("idToEdit").value = id;
    document.getElementById("newNamePopUp").value = name;
    document.getElementById("newPricePopUp").value = price;
    document.getElementById("newQuantityPopUp").value = qty;
    document.getElementById("newLocationPopUp").value = location;
    document.getElementById("newPackagedPopUp").value = packaged;
}


async function editFoodItem() {
    // Get data from pop-up
    var id = document.getElementById("idToEdit").value;
    var newName = document.getElementById("newNamePopUp").value;
    var newPrice = document.getElementById("newPricePopUp").value;
    var newQty = document.getElementById("newQuantityPopUp").value;
    var newLocation = document.getElementById("newLocationPopUp").value;
    var newPackaging = document.getElementById("newPackagedPopUp").value;

    // Run SQL query
    const newFoodInfo = {
        foodid: parseInt(id),
        foodname: newName,
        unitprice: parseFloat(newPrice).toFixed(2),
        foodquantity: parseFloat(newQty).toFixed(2),
        storagetype: newLocation,
        packaged: newPackaging
    }

    const editResponse = await fetch('/editFoodItem', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFoodInfo)
    });

    // Update the foodItems DB
    const foodItemsResponse = await fetch('/updateFoodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    // Clear and update the table
    var table = document.getElementById("items");
    table.rows[id].cells[1].innerHTML = newName;
    table.rows[id].cells[2].innerHTML = "€ " + parseFloat(newPrice).toFixed(2);
    table.rows[id].cells[3].innerHTML = parseFloat(newQty).toFixed(2);
    table.rows[id].cells[4].innerHTML = newLocation;
    table.rows[id].cells[5].innerHTML = newPackaging;
}


function searchFunction(x) {
    document.getElementById(x).focus();
}
