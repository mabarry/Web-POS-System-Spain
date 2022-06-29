const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
var path = require('path');


app.use(cors({origin: "*"}));
app.use(express.static('projectFiles'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Point of Sales system listening on port ${port}`)
})


const {Client} = require('pg');
const { query } = require('express');
const { hasSubscribers } = require('diagnostics_channel');
const client = new Client({
  host: "csce-315-db.engr.tamu.edu",
  user: "csce315950_1user",
  port: 5432,
  password: "team1won",
  database: "csce315950_1db"
})
client.connect();




// Load in databases on start
var foodItems;
var customerSaleLine;
var customerOrder;
var employeeList;
var vendorOrder;
var vendorBuyLine;

updateFoodItems();
updateCustomerSaleLine();
updateCustomerOrder();
updateEmployeeList();
updateVendorOrder();
updateVendorBuyLine();


// UPDATING THE DATABASE VARIABLE FUNCTIONS
function updateFoodItems() {
    client.query('SELECT * FROM fooditems ORDER BY foodid ASC',(err, res)=>{
        if (!err) {
            console.log("Query: foodItems");
            foodItems = res.rows
        } 
        else {
            console.log("\nERROR:");
            console.log(err.message);
        }
    });
}

function updateCustomerSaleLine() {
    client.query('SELECT * FROM customersaleline ORDER BY salelineid ASC',(err, res)=>{
        if (!err) {
            console.log("Query: customerSaleLine");
            customerSaleLine = res.rows
        } 
        else {
            console.log("\nERROR:");
            console.log(err.message);
        }
    });
}

function updateCustomerOrder() {
    client.query('SELECT * FROM customerorder ORDER BY customerorderid ASC',(err, res)=>{
        if (!err) {
            console.log("Query: customerOrder");
            customerOrder = res.rows
        } 
        else {
            console.log("\nERROR:");
            console.log(err.message);
        }
    });
}

function updateEmployeeList() {
    client.query('SELECT * FROM employeelist ORDER BY employeeid ASC',(err, res)=>{
        if (!err) {
            console.log("Query: employeeList");
            employeeList = res.rows
        } 
        else {
            console.log("\nERROR:");
            console.log(err.message);
        }
    });
}

function updateVendorOrder() {
    client.query('SELECT * FROM vendororder ORDER BY vendororderid ASC',(err, res)=>{
        if (!err) {
            console.log("Query: vendorOrder");
            vendorOrder = res.rows
        } 
        else {
            console.log("\nERROR:");
            console.log(err.message);
        }
    });
}

function updateVendorBuyLine() {
    client.query('SELECT * FROM vendorbuyline ORDER BY vendorlineid ASC',(err, res)=>{
        if (!err) {
            console.log("Query: vendorBuyLine");
            vendorBuyLine = res.rows
        } 
        else {
            console.log("\nERROR:");
            console.log(err.message);
        }
    });
}

app.get('/updateFoodItems', function(req, res){
    updateFoodItems();
    res.send("Complete");
});

app.get('/updateCustomerSaleLine', function(req, res){
    updateCustomerSaleLine();
    res.send("Complete");
});

app.get('/updateCustomerOrder', function(req, res){
    updateCustomerOrder();
    res.send("Complete");
});

app.get('/updateEmployeeList', function(req, res){
    updateEmployeeList();
    res.send("Complete");
});

app.get('/updateVendorOrder', function(req, res){
    updateVendorOrder();
    res.send("Complete");
});

app.get('/updateVendorBuyLine', function(req, res){
    updateVendorBuyLine();
    res.send("Complete");
});


// GET FROM DATABASE FUNCTIONS
app.get('/foodItems', function(req, res){
    if(Object.keys(req.query).length === 0) {
        res.send(foodItems);
    }
    else if (req.query.foodid) {
        // Below is the code for creating an SQL command and querying the database for any general request query
        // Create the SQL query command
        // var command = 'SELECT * FROM fooditems WHERE '
        // Object.entries(req.query).forEach(entry => {
        //     const [key, value] = entry;
        //     command = command + key + "=\'" + value + "\' AND ";
        // });
        // command = command.substring(0, command.length-4) + "ORDER BY foodid ASC";
        // console.log(command);

        // client.query(command, (err, result)=>{
        //     if (!err) {
        //         res.send(result.rows);
        //     } else {
        //         console.log("\nERROR:");
        //         console.log(err.message);
        //     }
        // });
        res.send(foodItems[req.query.foodid - 1]);
    }




    
});

app.get('/customerOrder', function(req, res){
    if(Object.keys(req.query).length === 0) {
        res.send(customerOrder);
    }
    else {
        //
    }
});

app.get('/customerSaleLine', function(req, res){
    if(Object.keys(req.query).length === 0) {
        res.send(customerSaleLine);
    }
    else {
        //
    }
});

app.get('/employeeList', function(req, res){
    if(Object.keys(req.query).length === 0) {
        res.send(employeeList);
    }
    else {
        //
    }
});

app.get('/vendorOrder', function(req, res){
    if(Object.keys(req.query).length === 0) {
        res.send(vendorOrder);
    }
    else {
        //
    }
});

app.get('/vendorBuyLine', function(req, res){
    if(Object.keys(req.query).length === 0) {
        res.send(vendorBuyLine);
    }
    else {
        //
    }
});



// ADD TO DATABASE FUNCTIONS
app.post('/addCustomerOrder', function(req, res) {
    console.log("\nReq.body:");
    console.log(req.body);

    var orderID = req.body.customerorderid;
    var orderDate = req.body.customerorderdate;
    var orderTotal = req.body.customerordertotal;
    var payment = req.body.paymentmethod;
    var employeeID = req.body.employeeid;

    
    var command = 'INSERT INTO customerorder VALUES(' + orderID +', \'' + orderDate +'\', ' + orderTotal +', \'' + payment +'\', ' + employeeID + ')';
    console.log(command);

    client.query(command, (err, result)=>{
    if (!err) {
        console.log("COMPLETE\n\n");
        res.send("Completed");
    } 
    else {
        console.log("\nERROR:");
        console.log(err.message);
    }
    })
});

app.post('/addSaleLine', function(req, res) {
    console.log("\nReq.body:");
    console.log(req.body);

    var saleID = req.body.salelineid;
    var orderID = req.body.customerorderid;
    var foodID = req.body.foodid;
    var salePrice = req.body.salelineprice;
    var saleQty = req.body.salelinequantity;


    var command = 'INSERT INTO customersaleline VALUES(' + saleID +', \'' + orderID +'\', ' + foodID +', \'' + salePrice +'\', ' + saleQty + ')';
    console.log(command);

    client.query(command, (err, result)=>{
    if (!err) {
        console.log("COMPLETE\n\n");
        res.send("Completed");
    } 
    else {
        console.log("\nERROR:");
        console.log(err.message);
    }
    })
});



// EDIT DATABASE FUNCTION
app.put('/editFoodItems', function(req, res) {
    console.log("\nReq.body:");
    console.log(req.body);

    var foodID = req.body.foodid;
    var newQty = req.body.newquantity;

    var command = 'UPDATE fooditems SET foodquantity=' + newQty + ' WHERE foodid=' + foodID;
    console.log(command);

    client.query(command, (err, result)=>{
    if (!err) {
        console.log("COMPLETE\n\n");
        res.send("Completed");
    } 
    else {
        console.log("\nERROR:");
        console.log(err.message);
    }
    })
});
