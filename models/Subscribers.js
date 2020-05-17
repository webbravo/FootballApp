'use strict';

module.exports = (sequelize, DataTypes) => {
    const Subscribers = sequelize.define("Subscribers", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        status: {
            type: DataTypes.TINYINT
        },
        startDate: {
            type: DataTypes.DATEONLY
        },
        endDate: {
            type: DataTypes.DATEONLY
        }
    });


    Subscribers.associate = (models) => {
        models.Subscribers.belongsTo(models.User, {
            foreignKey: "userId"
        });

        models.Subscribers.belongsTo(models.User, {
            foreignKey: "subscriberId"
        });
        models.Subscribers.belongsTo(models.Transactions, {
            foreignKey: "transactionsId"
        });

    };

    return Subscribers;




};