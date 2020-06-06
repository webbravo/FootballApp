module.exports = (app) => {
    app.use("/api/users", require("./users/users.routes"));
    app.use("/api/live-games", require("./liveGames/games.routes"))
}