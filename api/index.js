module.exports = (app, jwt, validation) => {

    const controller = require("./users/users.controller");

    app.use("/api/authenticate", controller.authenticate);

    // Create a new users
    app.post("/api/users/signup", validation.addUser, controller.create);


    // Set attachUser as Global MiddleWare
    app.use(attachUser);


    // JWT Auth Middleware
    const checkJWT = jwt({
        secret: process.env.JWT_SECRET,
        issuer: "api.orbit",
        audience: "api.orbit",
        algorithms: ["HS256"],
        getToken: (req) => req.cookies.token,
    });

    app.use("/api/users", require("./users/users.routes")(checkJWT));
    app.use("/api/rapidapi", require("./rapidAPI/index"));

    app.use("/api/live-games", require("./liveGames/games.routes"));
    app.use("/api/prediction", require("./liveGames/games.routes"));
};


const attachUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Authentication Invalid",
        });
    }


    const decodedToken = require("jwt-decode")(token);

    if (!decodedToken) {
        return res.status(401).json({
            message: "There was a problem authorizing the request!",
        });
    } else {
        req.user = decodedToken;
        next();
    }
};