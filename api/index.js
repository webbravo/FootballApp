module.exports = (app, validation, csrfProtection) => {
    const controller = require("./users/users.controller");

    app.post("/api/users/authenticate", controller.authenticate);

    // Create a new users
    app.post("/api/users/signup", validation.addUser, controller.signup);

    // Set attachUser as Global MiddleWare
    app.use(attachUser);

    // JWT Auth Middleware to check request
    app.use(checkJWT);

    //  CSRF Protection
    //app.use(csrfProtection);


    //  CSRF Protection
    app.get("/api/csrf-token", (req, res) => {
        return res.json({
            csrfToken: req.csrfToken()
        });
    });


    app.use("/api/users", require("./users/users.routes"));

    app.use("/api/rapidapi", require("./rapidAPI/api.routes"));

    app.use("/api/prediction", require("./predictions/prediction.routes"));
};

// JWT Auth Middleware
const checkJWT = require("express-jwt")({
    secret: process.env.JWT_SECRET,
    issuer: "api.10dPredict",
    audience: "api.10dPredict",
    algorithms: ["HS256"],
    getToken: (req) => {
        const token = req.headers.authorization.split(' ')[1];
        return token
    }

});

const attachUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Authentication Invalid",
        });
    }

    const decodedToken = require("jwt-decode")(token.split(' ')[1]);


    if (!decodedToken) {
        return res.status(401).json({
            message: "There was a problem authorizing the request!",
        });
    } else {
        req.user = decodedToken;
        next();
    }
};