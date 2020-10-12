const jwtDecode = require("jwt-decode");
const storage = require('node-persist');
const redis = require('redis');
const moment = require('moment');


const settings = require('../../settings');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient(REDIS_PORT);

const {
   rapidAPIFetch
} = require("../rapidAPI/fetch");


//checks if fixture is duplicated [author@clintonnzedimma]
exports.validateDuplicateFixture = (outcomeList) => {
	let fixtureIdList = outcomeList.map(function(outcome){ return outcome.fixtureId });

	let isDuplicate = fixtureIdList.some(function(fixtureId, idx){ 
	    return fixtureIdList.indexOf(fixtureId) != idx 
	});


	return isDuplicate;
}



exports.fetchCachedOutcomes = (fixtureIdList)=> {
 return new Promise((resolve, reject)=>{
	redisClient.mget(fixtureIdList, function(err, cached) { 
		if (err) {
			reject(err);				
		} else {
		 resolve(cached);		
		}
		
	});
 })
}


exports.fetchFixtureData = (fixtureId) => {
 const todayDate = moment().format("YYYY-MM-DD");
 return new Promise((resolve, reject)=>{
	redisClient.mget(todayDate, function(err, data) { 
		if (err) {
			reject(err);				
		} else {
			data = JSON.parse(data[0])

		  	 let gameData = null;

			  for (country in data.countries) {;
            		for (i = 0; i < data.countries[country].length; i++) {
            			if (data.countries[country][i].fixture_id == fixtureId) {
            				gameData = data.countries[country][i]; 
            				resolve(gameData);
            				return;
            			}
            		}
	          }

		 				
		}
		
	});
 })	
}
