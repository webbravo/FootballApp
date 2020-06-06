const axios = require('axios');
const moment = require('moment');

// Get live games for today's date
exports.getByDate = async (req, res) => {

   // Get today's date
   const todayDate = moment().format("YYYY-MM-DD");

   // Get url
   const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/date/${todayDate}`;

   // Make the request for matches
   const matches = await request(url);

   // send back response and status code
   res.status(200).json(matches)

};


// Get by live games Team id
exports.getByTeamId = async (req, res) => {

   // TODO: sort by date

   // Get team ID
   const teamId = parseInt(req.params.id) || 33;

   // Set request url
   const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/team/${teamId}`;

   // Make the request for matches
   const matches = await request(url);

   // send back response and status code
   res.status(200).json(matches)

};




// Get by live games Fixture id
exports.getByFixtureId = async (req, res) => {

   // Get today's date
   const fixtureId = parseInt(req.params.id) || 157508;

   // Set request url
   const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/id/${fixtureId}`;

   // Make the request for matches
   const matches = await request(url);

   // send back response and status code
   res.status(200).json(matches)

};


// Get by live league ID oredered By Date
exports.getByLeagueId = async (req, res) => {

   // Get today's date
   const leagueId = parseInt(req.params.id) || 2;

   // Get today's date
   const todayDate = moment().format("YYYY-MM-DD");

   // Set request url
   const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${leagueId}/${todayDate}`;

   // Make the request for matches
   const matches = await request(url);

   // send back response and status code
   res.status(200).json(matches)

};


const request = async (url) => {
   try {
      const response = await axios.get(url, {
         headers: {
            'x-rapidapi-host': process.env.API_HOST,
            'x-rapidapi-key': process.env.API_KEY
         }
      });
      return response.data;
   } catch (err) {
      console.error(err)
   }
}