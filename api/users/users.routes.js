const express = require('express');
const controller = require('./users.controller');
const router = express.Router();
const validation = require('../../middlewares/validations');


// Get all users
router.get("/", controller.all);

// Create a new users
router.post("/", validation.addUser, controller.create);

// login a user
router.post("/login", controller.login)

// Display a welcome message
router.get("/welcome", controller.welcome);

// Get user by username
router.get("/:username", controller.findByUsername);

// Update User Record
router.put("/:id", controller.update)

// Get user by id
router.get("/id/:id", controller.findById);

//  Delete user record
router.delete("/:id", controller.delete);

// Permanently Delete user record
// router.delete("/final/:id", controller.delete);







module.exports = router