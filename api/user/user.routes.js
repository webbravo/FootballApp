const express = require('express');
const controller = require('./user.controller');
const router = express.Router();

// Get all users
router.get("/", controller.allUser);

// Add a new users
router.post("/", controller.addUser);

// Display a welcome message
router.get("/welcome", controller.welcome);

//Get user by id
router.get("/:id", controller.getUserbyId);


module.exports = router