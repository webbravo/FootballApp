const app = require("./app");
const db = require("./models/connection");
const redis = require("redis");

// import environmental variables from our variables.env file
require("dotenv").config({
    path: ".env",
});
app.set("REDIS_PORT", process.env.REDIS_PORT || 6379);

const client = redis.createClient(app.get("REDIS_PORT"));

app.set("port", process.env.PORT || 8600);

db.sequelize.sync().then(() => {
    const server = app.listen(app.get("port"), () => {
        console.debug(
            `Connected & Express is Serving on → PORT http://127.0.0.1:${
      server.address().port
    }`
        );
    });
})