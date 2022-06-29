const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
var path = require('path');


app.use(cors({origin: "*"}));
app.use(express.static('projectFiles'));

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

var customerSaleLine;
client.query('SELECT * FROM customersaleline ORDER BY salelineid ASC',(err, res)=>{
    if (!err) {
        console.log("Query: customeSaleLine");
        customerSaleLine = res.rows
    } 
    else {
        console.log("\nERROR:");
        console.log(err.message);
    }
});

var customerOrder;
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

var customerSaleLine;
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

var employeeList;
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

var vendorOrder;
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

var vendorBuyLine;
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


// TODO: How to get keys from req.query
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

app.get('/customerSaleLine', function(req, res){
    if(Object.keys(req.query).length === 0) {
        res.send(customerSaleLine);
    }
    else {
        //
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




app.post('/addCustomerOrder', function(req, res) {
  orderID = req.body.customerorderid;
  orderDate = req.body.customerorderdate;
  orderTotal = req.body.customerordertotal;
  payment = req.body.paymentmethod;
  employeeID = req.body.employeeid;
  
  var vendorBuyLine;
  client.connect();
  var command = 'INSERT INTO customerorder VALUES(' + orderID +', ' + orderDate +', ' + orderTotal +', ' + payment +', ' + employeeID + ')';
  client.query(command, (err, res)=>{
    if (!err) {
      console.log("COMPLETE\n\n");
    } else {
      console.log("\nERROR:");
      console.log(err.message);
    }
    client.end();
  })
});

// Post = new
// Put = edit
// Delete
