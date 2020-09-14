const express = require("express");
const router = express.Router();
const cache = require('../../middlewares/redis-cache');
const controller = require('./api.controller');


router.get("/countries", controller.getCountries);

router.get("/leagues/country/:country", cache.get, controller.getLeaguesByCountry);

router.get("/fixtures/league/:league_id", cache.get, controller.getFixturesFromLeagueId);

router.get("/odds/fixture/:fixture_id", controller.getOddsByFixturesId);

router.get("/odds/league/:league_id", controller.getOddsByLeagueId);

router.get("/fixtures/today", controller.getFixturesForToday);

router.get("/odds/today", cache.get, controller.getOddsForToday);



module.exports = router;