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
    var location = document.getElementById("newLocation").value;
    var packaging = document.getElementById("newPackaging").value;

    // Create JSON object
    const newFoodInfo = {
        foodid: parseInt(foodID),
        foodname: name,
        unitprice: parseFloat(price).toFixed(2),
        foodquantity: '0.00',
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
    <td>0.00</td> \
    <td>' + location + '</td> \
    <td><button type="button" class="btn btn-primary" onclick="">Edit</button></td> \
    <td><button type="button" class="btn btn-outline-danger" onclick="">X</button></td>';

    tr.innerHTML = rowText;
    console.log(rowText);
    table.appendChild(tr);

    // Clear all the boxes
    document.getElementById("newName").value = '';
    document.getElementById("newPrice").value = '';
    document.getElementById("newLocation").value = '';
    document.getElementById("newPackaging").value = '';
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


    // Remove the row from the items table
    row.parentNode.removeChild(row);

    // Update the food items DB
    const foodItemsResponse = await fetch('/updateFoodItems', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    // Clear all the boxes
    document.getElementById("newName").value = '';
    document.getElementById("newPrice").value = '';
    document.getElementById("newLocation").value = '';
    document.getElementById("newPackaging").value = '';
}