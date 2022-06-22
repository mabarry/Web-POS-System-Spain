var accessibility = false;


function clearBox(x) {
    document.getElementById(x).value = "";
}


function clearBoxes() {
    document.getElementById('foodID').value = "";
    document.getElementById('foodQuantity').value = "";
}


function searchFunction(x, y) {
    document.getElementById(x).value = "";
    document.getElementById(x).blur();
    document.getElementById(y).focus();
}


function accessibleMode() {
    if(accessibility) {
        document.getElementById('accessibilityButton').setAttribute('class', 'accessibility');
    }
    else {
        document.getElementById('accessibilityButton').setAttribute('class', 'accessibilityOn');
    }
}


function deleteRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}


function addRow() {
    var name = "TestFood (#56)";
    var price = "$9.99";
    var qty = "10"
    
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
}