'use strict';

module.exports = (sequelize, DataTypes) => {

  const Outcomes = sequelize.define("Outcomes", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },

    leagueId: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    fixtureId: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    homeTeamId: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    awayTeamId: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    oddLabelId: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    oddLabelName: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        notNull: true,
      },
      allowNull: false
    },

    eventTimeStamp: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        notNull: true,
      },
      allowNull: false
    },

    elasped: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        len: [2, 3],
      },
      allowNull: true
    },

    value: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        notNull: true,
      },
      allowNull: false
    },

    odd: {
      type: DataTypes.FLOAT(3, 2),
      validate: {
        isFloat: true,
        notNull: true,
      },
      allowNull: false,
    },

    won: DataTypes.TINYINT,

    
  });


  Outcomes.associate = (models) => {
    models.Outcomes.belongsTo(models.Prediction, {
      foreignKey: "slipCode"
    });
  };


  return Outcomes;

};