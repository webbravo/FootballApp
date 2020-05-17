const express = require("express");


// Initialize Express app
const app = express();


// Setup the API
// require("./api/index")
require("./api")(app);


app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

// Export app module
module.exports = app;