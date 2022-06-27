const express = require('express')
const app = express()
const port = 3000
var path = require('path');

var filePath = path.join(__dirname, 'public');

app.use(express.static(filePath));

// Connect to database
const {Client} = require('pg');
const client = new Client({
    host: "csce-315-db.engr.tamu.edu",
    user: "csce315950_1user",
    port: 5432,
    password: "team1won",
    database: "csce315950_1db"
})
client.connect();


app.listen(port, () => {
  console.log(`Point of Sales system listening on port ${port}`)
})


