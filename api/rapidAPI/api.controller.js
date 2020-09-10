const cache = require('../../middlewares/redis-cache');
const countries = require('./countryList');
const settings = require('../../settings');

const {
   rapidAPIFetch
} = require("./fetch");

// Get live games for today's date
exports.getByDate = async (req, res) => {

   // Get today's date
   const todayDate = moment().format("YYYY-MM-DD");

   // Get url
   const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/date/${todayDate}`;

   // Make the request for matches
   const matches = await request(url);

   // Cache the result from Matches
   cache.set({
      "key": todayDate,
      "matches": matches.api.fixtures
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
 * /v2/fixtures/league/{league_id}/{date}"
 *
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
 * /v2/odds/fixture/{fixture_id}/bookmaker/{bookmakerid}
 */
exports.getOddsByFixturesId = async (req, res) => {
   try {
      const bookmaker = settings.bookmarker;
      const fixture_id = 326087 || req.params.fixture_id;
      const {
         data
      } = await rapidAPIFetch.get(`/odds/fixture/${fixture_id}`);

      cache.set({
         "key": fixture_id,
         "data": data.api
      });

      console.log(data.api);

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



// Get odds by league id
exports.getOddsByLeagueId = async (req, res) => {


}


//Get Odds for today
exports.getOddsForToday = async (req, res) => {


}

// Get Fixtures for Today
exports.getFixturesForToday = async (req, res) => {


}

