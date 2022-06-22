var accessibility = false;


function clearBox(which) {
    document.getElementById(which).value = "";
}

function accessibleMode() {
    if(accessibility) {

    }
    else {
        document.getElementById('accessibilityButton').setAttribute('class', 'accessibilityOn');
    }
}

function deleteRow(rowNum) {
    document.getElementById("orders").deleteRow(rowNum);
}