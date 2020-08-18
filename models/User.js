'use strict';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("User", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true,
            },
            allowNull: false,
            unique: true,
        },

        phone: {
            type: DataTypes.STRING,
            validate: {
                len: [11, 14],
            },
            allowNull: false,
            unique: true,
        },

        firstName: {
            type: DataTypes.STRING,
            validate: {
                len: [2, 24],
                isAlpha: true,
            },
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                len: [4, 34]
            },
        },

        gender: {
            type: DataTypes.STRING,
            validate: {
                len: [4, 6],
                isAlpha: true,
            },
        },

        country: {
            type: DataTypes.STRING,
            validate: {
                isAlpha: true,
                len: [4, 46],
            },
        },

        city: {
            type: DataTypes.STRING,
            validate: {
                isAlpha: true,
                len: [3, 30],
            },
        },

        address: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true,
                len: [3, 230],
            },
        },

        bankAccount: {
            type: DataTypes.INTEGER,
            validate: {
                isNumeric: true,
                len: [10, 11],
            },
            unique: true
        },

        bankAccountType: {
            type: DataTypes.STRING,
        },

        bankName: {
            type: DataTypes.STRING,
            validate: {
                isAlpha: true,
            }
        },

        dobMonth: {
            type: DataTypes.STRING,
            validate: {
                isAlpha: true,
            }
        },

        dobDay: {
            type: DataTypes.INTEGER,
            validate: {
                isNumeric: true,
                len: [1, 2],
            },
        },

        dobYear: {
            type: DataTypes.INTEGER,
            validate: {
                len: [4, 4],
            },
        },

        role: {
            type: DataTypes.STRING,
            validate: {
                isAlpha: true,
                len: [4, 6]
            },

        },

        refreshToken: {
            type: DataTypes.STRING,
            validate: {
                isAlpha: true,
                len: [4, 60]
            }
        },

        resetPasswordToken: {
            type: DataTypes.STRING,
            validate: {
                isAlpha: true,
                len: [4, 20]
            }
        },

        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1
        }
    });


    return User;

};