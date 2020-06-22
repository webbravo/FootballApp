const express = require("express");
var bodyParser = require('body-parser');

// Initialize Express app
const app = express();


// Global Variables
global.axios = require('axios');
global.moment = require('moment');

// ******* SET UP  MIDDLEWARE ********* //

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

// Will handle text/plain requests
app.use(bodyParser.text());

// Setup CORS
app.use(require('cors')({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Use express middleware for easier cookie handling
app.use(require("cookie-parser")());

// Setup the API
require("./api")(app);


app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

// Export app module
module.exports = app;