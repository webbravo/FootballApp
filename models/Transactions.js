const Sequelize = require('sequelize');
const connection = require('./connection');
const User = require('./User');

const Transactions = connection.define("transactions", {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },

    refId: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true
        },
        allowNull: false,
    },

    amount: {
        type: Sequelize.NUMBER,
        validate: {
            isNumeric: true,
            len: [1, 4]
        },
        allowNull: false
    },
    balance: {
        type: Sequelize.NUMBER,
        validate: {
            isNumeric: true,
            len: [1, 4]
        },
        allowNull: false
    },

    remark: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true,
            len: [4, 60],
        },
        allowNull: false
    },
    transactionType: Sequelize.TINYINT,
    status: Sequelize.STRING,
    date: Sequelize.DATE,

});

Transactions.belongsTo(User);



module.exports = Transaction;