module.exports = (checkJWT) => {

    const express = require('express');
    const controller = require('./users.controller');
    const router = express.Router();
    const validation = require('../../middlewares/validations');
    const {
        isAuth
    } = require('../../middlewares/isAuth.js');

    // Get all users
    router.get("/", controller.all);


    // login a user
    router.post("/authenticate", validation.loginUser, controller.authenticate);


    // logout a user
    router.post("/logout", controller.logout)

    // Display a welcome message
    router.get("/welcome", controller.welcome);

    // Protected Route
    router.post("/protected", isAuth, controller.protected);

    // Protected Find User Route
    router.post("/protected-user", isAuth, controller.findByIdP);

    // Get user by username
    router.get("/:username", controller.findByUsername);

    // Update User Record
    router.put("/:id", controller.update)

    // Get user by id Route: @Private
    router.get("/id/:id", controller.findById);

    //  Delete user record
    router.delete("/:id", controller.delete);

    // Get Refresh Token
    router.post('/refresh_token', controller.refreshtoken);


    // Permanently Delete user record
    // router.delete("/final/:id", controller.delete);



    return router
}