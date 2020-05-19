'use strict';

module.exports = (sequelize, DataTypes) => {

  const Bet = sequelize.define("Bet", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },

    leagueId: {
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    fixtureId: {
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    homeTeamId: {
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    awayTeamId: {
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 10],
      },
      allowNull: false
    },

    oddLabelId: {
      type: DataTypes.NUMBER,
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
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
      },
      allowNull: false
    },

    firstHalfStart: {
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
      },
      allowNull: false
    },

    secondHalfStart: {
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
      },
      allowNull: false
    },

    elasped: {
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
        len: [2, 3],
      },
      allowNull: false
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

    betSlipCode: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        notNull: true,
        len: [8, 9],
      },
      allowNull: false
    },

    likes: {
      type: DataTypes.NUMBER,
      validate: {
        isNumeric: true,
        notNull: true,
      },
      allowNull: false,
      defaultValue: 1
    },

    status: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        notNull: true,
        len: [3, 60],
      },
      allowNull: false
    },

    won: DataTypes.TINYINT,
    isPrivate: DataTypes.TINYINT,
  });


  Bet.associate = (models) => {
    models.Bet.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };


  return Bet;

};