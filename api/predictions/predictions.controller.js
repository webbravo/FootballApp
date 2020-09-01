const User = require("../../models/connection").User;



exports.welcome = (req, res) => {
  res.send("Welcome to Prediction Route, it Controllers user prediction history")
};


exports.all = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        status: 1,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({
      err: error.message,
    });
  }
};