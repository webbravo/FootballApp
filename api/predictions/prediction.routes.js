const express = require('express');
const controller = require('./predictions.controller');
const router = express.Router();


router.get("/", (req, res) => {
    res.send("Welcome to Prediction Route")
});

router.get("/create", controller.createPrediction)

router.get("/:slipCode", controller.getPrediction)

router.get("/outcomes", controller.getAllOutcomes)

module.exports = router;