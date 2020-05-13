const Sequelize = require("sequelize");

// Connect to Sqlite DB
const connection = new Sequelize(process.env.DB_NAME, process.env.DB_HOST, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'sqlite',
    storage: "db.sqlite",
    operatorAliases: false,
    define: {
        freezeTableName: true,
    },
});

module.exports = connection;