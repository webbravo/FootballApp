module.exports = (app, checkJWT) => {
    app.use("/api/users", require("./users/users.routes"));
    app.use("/api/live-games", require("./liveGames/games.routes"));
    app.use("/api/prediction", require("./liveGames/games.routes"));
}