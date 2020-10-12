const jwtDecode = require("jwt-decode");
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');
const unescapeJs = require('unescape-js');


const User = require("../../models/connection").User;
const Prediction = require("../../models/connection").Prediction;
const Outcomes = require("../../models/connection").Outcomes;
const h = require('./predictions.helpers');


const settings = require('../../settings');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient(REDIS_PORT);


const {
   rapidAPIFetch
} = require("../rapidAPI/fetch");


exports.welcome = (req, res) => {
  res.send("Welcome to Prediction Route, it Controllers user prediction history")
};


exports.all = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        status: 1,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({
      err: error.message,
    });
  }
};

// create prediction [author@clintonnzedimma]
exports.createPrediction =  async(req, res) => {
    try {
     const tokenUser = jwtDecode(req.cookies.token);
     console.log(tokenUser.sub)
     let error = null;
     let success = false;
     let message = null;
     let slipCode = uuidv4().substr(0,7).toUpperCase();
     let prediction = req.body.prediction;
     let invalid_odd_outcome = null;

     prediction.code = slipCode;

     let currentTimestamp = moment().unix();

     // error handling below
     if (h.validateDuplicateFixture(prediction.outcomes)) {
        error = `Fixtures cant repeat.`;
         return res.status(200).json({
            success,
            error,
            invalid_odd_outcome,
          }); 


     }else if (prediction.outcomes.length < 10 ) {
          error = `Selected outcomes is supposed to be 10. Only ${prediction.outcomes.length} selected`;
         return res.status(200).json({
            success,
            error,
            invalid_odd_outcome,
          });       
     } else if (!h.validateDuplicateFixture(prediction.outcomes) 
          && prediction.outcomes.length == 10) {

          let fixtureIdList = prediction.outcomes.map(function(outcome){ return outcome.fixtureId });

          let cachedFixtureOutcomes =  await h.fetchCachedOutcomes(fixtureIdList);


           /**
            * The block below is securely validating the odds of each outcome for a specific fixture id
            * Fixture outcome  data is fetched for the Redis cache
           */  

          let fixtureOutcomes = [];
          let singleFixtureOutcome = null;


          for (var i = 0; i < cachedFixtureOutcomes.length; i++) {
              fixtureOutcomes[i] = JSON.parse(unescape(cachedFixtureOutcomes[i]));


              singleFixtureOutcome = fixtureOutcomes[i].filter(o => o.label_id === prediction.outcomes[i].label_id)[0].values.filter(s=> s.value == prediction.outcomes[i].value);


              if (parseFloat(singleFixtureOutcome[0].odd) < 1.50) {

                    invalid_odd_outcome =  singleFixtureOutcome[0];
                    invalid_odd_outcome.fixtureId = prediction.outcomes[i].fixtureId;
                    invalid_odd_outcome.label_name = prediction.outcomes[i].label_name;
                    invalid_odd_outcome.label_id = prediction.outcomes[i].label_id;

                    error = `Fixture odd less than 1.5`;

                    return res.status(200).json({
                      success,
                      error,
                      invalid_odd_outcome,
                    });

              }

          }




         /**
          * The block below is for securely validating match time
          * Match data is fetched for the Redis cache
         */  

  
       let fixtureData = null; 
       let belatedFixtures = [];

       for (var i = 0; i < fixtureIdList.length; i++) {
           fixtureData = await h.fetchFixtureData(fixtureIdList[i]);

           if (currentTimestamp > fixtureData.event_timestamp) {
              error  = `Some fixtures can no longer be selected`;

              belatedFixtures.push(fixtureIdList[i]);
            } 

        }


        if (belatedFixtures.length > 0) {
             return res.status(200).json({
              success,
              error,
              belatedFixtures,
              invalid_odd_outcome,
            });   
        }
 


         /**
          * The block below is for creating Fixture and Outcome
         */ 

 


         let predictionEntry = await Prediction.create({
                userId : tokenUser.sub,
                betSlipCode : prediction.code
          });


          let outcomeData = [];

          for (var i = 0; i < prediction.outcomes.length; i++) {
            outcomeData[i] = {};
            
            fixtureData = await h.fetchFixtureData(prediction.outcomes[i].fixtureId);

            for (key in prediction.outcomes[i]) {
             outcomeData[i][key] = prediction.outcomes[i][key];
            }

            for (key in fixtureData) {
             outcomeData[i][key] = fixtureData[key];
            }
          }


      

           //console.log(outcomeData[0])

           outcomeData = outcomeData.map(o => {
              return  {
                oddLabelId : o.label_id,
                oddLabelName : o.label_name,
                value : o.value, 
                odd : parseFloat(o.odd),
                leagueId : o.league_id ,
                fixtureId : o.fixture_id, 
                homeTeamId : o.homeTeam.team_id,
                awayTeamId : o.awayTeam.team_id,
                eventTimeStamp : o.event_timestamp,
                slipCode : prediction.code
              }
           })


         if (predictionEntry) {

            let outcomeEntry = await Outcomes.bulkCreate(outcomeData)

            if (outcomeEntry) {
              success = "Prediction created successfully";
              error = false;
              return res.status(200).json({
                success,
                error,
                invalid_odd_outcome,
              }); 
            }    
         }
     }
    } catch (e) {
      console.log(e)
     }

}

// fetch outcome by bet slip code [author@clintonnzedimma]
exports.getPrediction = async (req, res) => {

}


// fetch outcome by id [author@clintonnzedimma]
exports.getAllOutcomes = async (req, res) => {

}

// fetch outcome by id
exports.getOutcome = async (req, res) => {

}


// console.log();