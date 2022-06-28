const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
var path = require('path');


app.use(cors({origin: "*"}));
app.use(express.static('CSCE_315_Project_3'));

app.listen(port, () => {
  console.log(`Point of Sales system listening on port ${port}`)
})


const {Client} = require('pg');
const client = new Client({
  host: "csce-315-db.engr.tamu.edu",
  user: "csce315950_1user",
  port: 5432,
  password: "team1won",
  database: "csce315950_1db"
})

var foodItems;
client.connect();
client.query('SELECT * FROM fooditems ORDER BY foodid ASC',(err, res)=>{
  if (!err) {
    console.log(res.rows);
    foodItems = res.rows
  } else {
    console.log("\nERROR:");
    console.log(err.message);
  }
  client.end();
})

var customerOrder;
client.connect();
client.query('SELECT * FROM customerorder ORDER BY customerorderid ASC',(err, res)=>{
  if (!err) {
    console.log(res.rows);
    customerOrder = res.rows
  } else {
    console.log("\nERROR:");
    console.log(err.message);
  }
  client.end();
})

var customerSaleLine;
client.connect();
client.query('SELECT * FROM customersaleline ORDER BY salelineid ASC',(err, res)=>{
  if (!err) {
    console.log(res.rows);
    customerSaleLine = res.rows
  } else {
    console.log("\nERROR:");
    console.log(err.message);
  }
  client.end();
})

var employeeList;
client.connect();
client.query('SELECT * FROM employeelist ORDER BY employeeid ASC',(err, res)=>{
  if (!err) {
    console.log(res.rows);
    employeeList = res.rows
  } else {
    console.log("\nERROR:");
    console.log(err.message);
  }
  client.end();
})

var vendorOrder;
client.connect();
client.query('SELECT * FROM vendororder ORDER BY vendororderid ASC',(err, res)=>{
  if (!err) {
    console.log(res.rows);
    vendorOrder = res.rows
  } else {
    console.log("\nERROR:");
    console.log(err.message);
  }
  client.end();
})

var vendorBuyLine;
client.connect();
client.query('SELECT * FROM vendorbuyline ORDER BY vendorlineid ASC',(err, res)=>{
  if (!err) {
    console.log(res.rows);
    vendorBuyLine = res.rows
  } else {
    console.log("\nERROR:");
    console.log(err.message);
  }
  client.end();
})

app.get('/foodItems', function(req, res){
  res.send(foodItems);
});

app.get('/customerOrder', function(req, res){
  res.send(customerOrder);
});

app.get('/customerSaleLine', function(req, res){
  res.send(customerSaleLine);
});

app.get('/employeeList', function(req, res){
  res.send(employeeList);
});

app.get('/vendorOrder', function(req, res){
  res.send(vendorOrder);
});

app.get('/vendorBuyLine', function(req, res){
  res.send(vendorBuyLine);
});
