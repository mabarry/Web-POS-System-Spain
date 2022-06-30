async function checkPassword() {

    // Query the database to get the employee table
    var employeeid = document.getElementById("userNameInput").value;
    var enteredPassword = document.getElementById("passwordInput").value;

    const employeeInformation = {
        employeeID: parseInt(employeeid)
    }
    
    // Query the employeeList for a specific employeeid
    const response = await fetch('/employeeList', {
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
        document.getElementById("loginCheck").innerHTML = "Incorrect Username/Password.";
        clearLoginBoxes();
    }
}