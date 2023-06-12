//const dotenv = require("dotenv");
//dotenv.config();

//const fetch = require("node-fetch");
//var path = require("path");
const express = require("express");

const app = express();

const bodyParser = require("body-parser");
/* Middleware*/

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
const { response } = require("express");
app.use(cors());

app.use(express.static("dist"));

console.log(__dirname);

// allows get requests to be used in app

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
  res.sendFile(path.resolve("src/client/views/index.html"));
});

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
  console.log(`Example app listening on port 8081!`);
});

let trips = [];

// Route to get all trips
app.get("/trips", (req, res) => {
  console.log(trips);

  res.json(trips);
  console.log(trips);
});

// Route to add a trip
app.post("/trips", (req, res) => {
  const trip = req.body;
  trips.push(trip);
  res.json({ message: "Trip added successfully" });
  console.log(trips);
});
