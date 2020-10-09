'use strict';

module.exports = (sequelize, DataTypes) => {

  const Prediction = sequelize.define("Prediction", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },

     betSlipCode: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        notNull: true,
      },
       unique: true,
      allowNull: false
    },

    likes: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        notNull: true,
      },
      allowNull: false,
      defaultValue: 0
    },

    accurate: {
      type: DataTypes.TINYINT,
      allowNull: true
    },

    isPremium: DataTypes.TINYINT,
  });


  Prediction.associate = (models) => {
    models.Prediction.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };


  return Prediction;

};