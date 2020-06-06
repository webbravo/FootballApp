const express = require('express');
const controller = require('./games.controller');
const router = express.Router();


// TODO: Implement Redis Caching

// Get all games for today date
router.get("/", controller.getByDate);


// Get games by team Id
router.get("/team/:id", controller.getByTeamId);


// Get games by fixture Id
router.get("/fixture/:id", controller.getByFixtureId);


// Get games by league Id and Date
router.get("/league/:id", controller.getByLeagueId);


module.exports = router