const express = require("express");
const User = require("./models/User");


// Initialize Express app
const app = express();


// Create User Table


app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

// Export app module
module.exports = app;