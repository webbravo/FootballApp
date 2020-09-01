const express = require('express');
const controller = require('./predictions.controller');
const router = express.Router();


router.get("/", (req, res) => {
    res.send("Welcome to Prediction Route")
});

module.exports = router;