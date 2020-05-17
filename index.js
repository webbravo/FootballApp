const app = require("./app");
const db = require("./models/connection");

// import environmental variables from our variables.env file
require("dotenv").config({
    path: ".env",
});

app.set("port", process.env.PORT || 8600);

db.sequelize.sync({
    force: true
}).then(() => {
    const server = app.listen(app.get("port"), () => {
        console.debug(
            `Connected & Express Serving on → PORT http://127.0.0.1:${
      server.address().port
    }`
        );
    });
})