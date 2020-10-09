const express = require("express");
const router = express.Router();
const cache = require('../../middlewares/redis-cache');
const controller = require('./api.controller');


router.get("/", controller.welcome);

router.get("/countries", controller.getCountries);

router.get("/leagues/country/:country", cache.get, controller.getLeaguesByCountry);

router.get("/odds/fixture/:fixture_id", controller.getOddsByFixturesId);

router.get("/odds/today", cache.get, controller.getOddsForToday);

router.get("/odds/league/:league_id", controller.getOddsByLeagueId);

router.get("/fixtures/today", controller.getFixturesForToday);

router.get("/fixtures/today", controller.getFixturesForToday);

router.get("/fixtures/league/:league_id", cache.get, controller.getFixturesFromLeagueId);


module.exports = router;