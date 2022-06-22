var accessibility = false;

function clearBoxes() {
    document.getElementById("foodID").value = "";
    document.getElementById("foodQuantity").value = "";
}
/*
function searchFunction() {
    //document.getElementById(x).value = "";
    document.getElementById("foodID").blur();
    document.getElementById("foodQuantity").focus();
}
*/

function searchFunction(x, y) {
    //document.getElementById(x).value = "";
    document.getElementById(x).blur();
    document.getElementById(y).focus();
}


function accessibleMode() {
    if(accessibility) {
        document.getElementById('accessibilityButton').setAttribute('class', 'accessibility');
        accessibility = false;
    }
    else {
        document.getElementById('accessibilityButton').setAttribute('class', 'accessibilityOn');
        accessibility = true;
    }
}


function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}


function addRow() {
    var name = 'exampleFood (' + document.getElementById('foodID').value + ')';
    var price = "$9.99";
    var qty = document.getElementById('foodQuantity').value;

    if (document.getElementById('foodID').value === '' || document.getElementById('foodQuantity').value === '') {
        return;
    }

    // Create new row
    var tr = document.createElement('tr');

    // Create all columns
    rowText = ' \
    <td>' + name + '</td> \
    <td>' + price + '</td> \
    <td>' + qty + '</td> \
    <td><button type="button" class="btn btn-outline-danger" onclick="deleteRow(this)">X</button></td> \
    ';

    tr.innerHTML = rowText;
    var table = document.getElementById("orders")
    table.appendChild(tr);

    //Clearing text boxes containing food ID and quantity
    clearBoxes();
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
