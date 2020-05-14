const express = require('express');
const controller = require('./user.controller');
const router = express.Router();


router.get("/", controller.allUser);
router.post("/", controller.addUser);


router.get("/welcome", controller.welcome);


module.exports = router