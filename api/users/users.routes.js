const express = require('express');
const controller = require('./users.controller');
const router = express.Router();
const validation = require('../../middlewares/validations');


// Get all users
router.get("/", controller.all);

// Create a new users
router.post("/", validation.addUser, controller.create);

// login a user
router.post("/login", validation.loginUser, controller.login);

// logout a user
router.post("/logout", controller.logout)

// Display a welcome message
router.get("/welcome", controller.welcome);

// Protected Route
router.post("/protected", controller.protected);

// Get user by username
router.get("/:username", controller.findByUsername);

// Update User Record
router.put("/:id", controller.update)

// Get user by id
router.get("/id/:id", controller.findById);

//  Delete user record
router.delete("/:id", controller.delete);

// Get Refresh Token
router.post('/refresh_token', controller.refreshtoken);


// Permanently Delete user record
// router.delete("/final/:id", controller.delete);







module.exports = router