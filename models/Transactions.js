'use strict';

module.exports = (sequelize, DataTypes) => {
    const Transactions = sequelize.define("Transactions", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },

        refId: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true
            },
            allowNull: false,
        },

        amount: {
            type: DataTypes.NUMBER,
            validate: {
                isNumeric: true,
                len: [1, 4]
            },
            allowNull: false
        },
        balance: {
            type: DataTypes.NUMBER,
            validate: {
                isNumeric: true,
                len: [1, 4]
            },
            allowNull: false
        },

        remark: {
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true,
                len: [4, 60],
            },
            allowNull: false
        },
        transactionType: DataTypes.TINYINT,
        status: DataTypes.STRING,
        date: DataTypes.DATE,

    });

    // Transactions.belongsTo(User);
    Transactions.associate = (models) => {
        models.Transactions.belongsTo(models.User, {
            foreignKey: "userId"
        });
    };


    return Transactions;

};