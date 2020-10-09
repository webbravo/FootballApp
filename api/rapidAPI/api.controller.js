const cache = require('../../middlewares/redis-cache');
const countries = require('./countryList');
const settings = require('../../settings');
const moment = require('moment');

const {
   rapidAPIFetch
} = require("./fetch");



// Get live fixture for today's date
exports.getFixturesForToday = async (req, res) => {

   // Get today's date
   const todayDate = moment().format("YYYY-MM-DD");

   // Make the request for matches
   const {
      data
   } = await rapidAPIFetch.get(`/fixtures/date/${todayDate}`);


   // Filter to return only future matches(5min before start)
   const filteredMatches = data.api.fixtures.filter(filterMatches);


   //  Group available league by their countries
   const leaguesAndCountry = groupLeagueByCountry(filteredMatches, "country");


   const payload = {
      results: filteredMatches.length,
      countries: leaguesAndCountry
   }

   // Cache the result from Matches
   cache.set({
      "key": todayDate,
      "data": payload
   });

   // send back response and status code
   res.status(200).json(payload)

};

//
const groupLeagueByCountry = (list, key) => {
   return list.reduce(function (rv, x) {
      (rv[x["league"][key]] = rv[x["league"][key]] || []).push(x);
      return rv;
   }, {});
};


// Get the future date
const futureDate = () => moment().unix() + (60 * settings.timeGap);

// Return a list of matches to start in 5mins Time
const filterMatches = (match) => {
   const matchTime = match.event_timestamp;
   return matchTime > futureDate() &&
      match.status === "Not Started";
}


// Get live Odds for today's games
exports.getOddsForToday = async (req, res) => {

   // Get the bookmaker ID
   const bookmaker = settings.bookmarker;

   // Get today's date
   const todayDate = moment().format("YYYY-MM-DD");

   // Get url
   const url = `/odds/date/${todayDate}/bookmaker/${bookmaker}`;

   // Make the request for matches
   const matches = await rapidAPIFetch.get(url);

   // Cache the result from Matches
   cache.set({
      "key": todayDate,
      "data": matches.api.odds
   });

   // send back response and status code
   res.status(200).json(matches)

};


// Get a list of Available countries
exports.getCountries = async (req, res) => {

   try {
      res.json({
         countries
      });
      // Cache Countries list
   } catch (err) {
      console.error(err);
   }

}


exports.getLeaguesByCountry = async (req, res) => {

   const country = req.params.country;

   const leagues = await getLeagues(country);

   // Cache the list of available result
   cache.set({
      "key": country,
      "data": leagues
   });
   res.status(200).json(leagues);
};


/**
 * Get Fixture from the League ID
 */
exports.getFixturesFromLeagueId = async (req, res) => {

   // Get today's date
   const todayDate = moment().format("YYYY-MM-DD");

   try {
      const league_id = req.params.league_id;
      const {
         data
      } = await rapidAPIFetch.get(`/fixtures/league/${league_id}/${todayDate}`);

      // Cache the Fixtures from a particular League
      cache.set({
         "key": league_id,
         "data": data.api
      });

      res.status(200).json(data.api)
   } catch (error) {
      console.error(error);
   }

};


/**
 * Get live Odds By the Fixture ID
 *
 */
exports.getOddsByFixturesId = async (req, res) => {
   try {

      //  Get the Fixture Id
      const fixture_id = req.params.fixture_id || 569886;
      const {
         data
      } = await rapidAPIFetch.get(`/odds/fixture/${fixture_id}`);

      let filteredOdds = "";

      if (data.api.odds.length > 0) {
         filteredOdds = data.api.odds[0].bookmakers
            .filter((bookie) => (
               bookie.bookmaker_name === "Bet365"))[0].bets
            .filter((bet) => {
               return settings.outcomeToUse.includes(bet.label_name);
            });
      } else {
         filteredOdds = data.api;
      }

      //  Cache result
      cache.set({
         "key": fixture_id,
         "data": filteredOdds
      });

      res.status(200).json(filteredOdds)
   } catch (error) {
      console.error(error);
   }

};



exports.getOddsByLeagueId = async (req, res) => {
   try {
      const league_id = req.params.league_id;
      const {
         data
      } = await rapidAPIFetch.get(`/odds/league/${league_id}`);

      cache.set({
         "key": league_id,
         "data": data.api
      });

      res.status(200).json(data.api)
   } catch (error) {
      console.error(error);
   }
};


// Get by live games Team id
exports.getByTeamId = async (req, res) => {
   try {
      const id = req.params.league_id || 1383;

      // Make the request for matches
      const {
         data
      } = await rapidAPIFetch.get(`/fixtures/team/${teamId}`);

      res.status(200).json(data.api)
   } catch (error) {
      console.error(err);
   }

}


const getLeagues = async (country) => {
   try {

      const year = new Date().getFullYear();
      const {
         data
      } = await rapidAPIFetch.get(`/leagues/country/${country}/${year}`);
      return data.api.leagues;
   } catch (error) {
      console.error(error);
   }
}
