const express = require("express");
var bodyParser = require('body-parser');

// Initialize Express app
const app = express();


// SET UP  MIDDLEWARE
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

// Will handle text/plain requests
app.use(bodyParser.text());

// Setup the API
require("./api")(app);


app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

// Export app module
module.exports = app;