const connection = require("./connection");
const Sequelize = require("sequelize");

// Import model for Assications
const Transactions = require('./Transactions');
const Subscriber = require('./Transactions');

const User = connection.define("user", {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
        },
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true,
        },
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true
        },
        allowNull: false
    },
    phone: {
        type: Sequelize.NUMBER,
        validate: {
            isNumeric: true,
            len: [11, 14]
        },
        allowNull: false
    },

    firstName: {
        type: Sequelize.STRING,
        validate: {
            len: [4, 24],
            isAlpha: true
        }
    },
    lastName: {
        type: Sequelize.STRING,
        validate: {
            len: [4, 34],
            isAlpha: true
        }
    },

    gender: {
        type: Sequelize.STRING,
        validate: {
            len: [4, 6],
            isAlpha: true
        }
    },

    country: {
        type: Sequelize.STRING,
        validate: {
            isAlpha: true,
            len: [4, 46]
        }
    },

    city: {
        type: Sequelize.STRING,
        validate: {
            isAlpha: true,
            len: [3, 30]
        }
    },

    address: {
        type: Sequelize.STRING,
        validate: {
            isAlphanumeric: true,
            len: [3, 230]
        }
    },

    bankAccount: {
        type: Sequelize.NUMBER,
        validate: {
            isNumeric: true,
            len: [10, 11]
        }
    },

    bankAccountType: {
        type: Sequelize.STRING
    },

    bankName: {
        type: Sequelize.STRING,
        validate: {
            isAlpha: true
        }
    },

    dobMonth: {
        type: Sequelize.STRING,
        validate: {
            isAlpha: true
        }
    },

    dobDay: {
        type: Sequelize.NUMBER,
        validate: {
            isNumeric: true,
            len: [1, 2]
        }
    },

    dobYear: {
        type: Sequelize.NUMBER,
        validate: {
            len: [4, 4]
        }
    },

    isAdmin: Sequelize.TINYINT,

    status: Sequelize.TINYINT

});

// User.associate = (models) => {
//     models.User.belongsToMany(models.Book, {
//         as: 'Reading',
//         through: 'ReadingList'
//     });
//     models.User.hasOne(models.Favorite);
// };

module.exports = User;