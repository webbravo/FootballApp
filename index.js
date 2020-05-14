const app = require("./app");
const connection = require("./models/connection");

// import environmental variables from our variables.env file
require("dotenv").config({
    path: ".env",
});

app.set("port", process.env.PORT || 8600);

connection
    .sync({
        force: true
    })
    .then(() => {
        const server = app.listen(app.get("port"), () => {
            console.debug(
                `Connected & Express Serving on → PORT http://127.0.0.1:${
          server.address().port
        }`
            );
        });
    })
    .catch((err) => console.error(err));