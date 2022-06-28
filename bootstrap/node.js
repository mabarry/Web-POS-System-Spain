const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
var path = require('path');


app.use(cors({origin: "*"}));
app.use(express.static('public'));

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
    foodItems = res.rows
  } else {
    console.log("\nERROR:");
    console.log(err.message);
  }
  client.end();
})


app.get('/foodItems', function(req, res){
    res.send(foodItems);
});

