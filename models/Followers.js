'use strict';

module.exports = (sequelize, DataTypes) => {
    const Followers = sequelize.define("Followers", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        status: {
            type: DataTypes.TINYINT
        }
    });

    // model.Followers.belongsTo(User);
    Followers.associate = (models) => {

        models.Followers.belongsTo(models.User, {
            foreignKey: "userId"
        });

        models.Followers.belongsTo(models.User, {
            foreignKey: "followerId"
        });
    };


    return Followers;

};