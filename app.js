const express = require("express");
var bodyParser = require("body-parser");
const jwtDecode = require("jwt-decode");
const jwt = require("express-jwt");
const csrf = require("csurf");
const csrfProtection = csrf({
  cookie: true,
});

// Initialize Express app
const app = express();

// Global Variables
global.axios = require("axios");
global.moment = require("moment");

// ******* SET UP  MIDDLEWARE ********* //

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// parse application/json
app.use(bodyParser.json());

// Will handle text/plain requests
app.use(bodyParser.text());

// Setup CORS
app.use(
  require("cors")({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Use express middleware for easier cookie handling
app.use(require("cookie-parser")());

const attachUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Authentication Invalid",
    });
  }

  const decodedToken = jwtDecode(token);

  if (!decodedToken) {
    return res.status(401).json({
      message: "There was a problem authorizing the request!",
    });
  } else {
    req.user = decodedToken;
    next();
  }
};

// Set attachUser as Global MiddleWare
app.use(attachUser);

// JWT Auth Middleware
const checkJwt = jwt({
  secret: process.env.JWT_SECRET,
  issuer: "api.10dollar",
  audience: "api.10dollar",
  algorithms: ["HS256"],
  getToken: (req) => req.cookies.token,
});

app.use(csrfProtection);

//  CSRF Protection
app.get("/api/csrf-token", (req, res) => {
  return res.json({
    csrfToken: req.csrfToken(),
  });
});

// Setup the API
require("./api")(app, checkJwt);

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

// Export app module
module.exports = app;
