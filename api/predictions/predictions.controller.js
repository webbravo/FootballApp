const jwtDecode = require("jwt-decode");
const redis = require("redis");
const {
  v4: uuidv4
} = require("uuid");
const unescapeJs = require("unescape-js");

const {
  User,
  Prediction,
  Outcomes
} = require("../../models/connection");

const h = require("./predictions.helpers");

const {
  numbersOfOutcomeToPlay,
  lowestOdd
} = require("../../settings");

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient(REDIS_PORT);

const {
  rapidAPIFetch
} = require("../rapidAPI/fetch");

exports.welcome = (req, res) => {
  res.send(
    "Welcome to Prediction Route, it Controllers user prediction history"
  );
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
exports.createPrediction = async (req, res) => {

  try {

    const userId = req.user.sub;
    let error = null;
    let success = false;
    let message = null;
    let slipCode = uuidv4().substr(0, 7).toUpperCase();


    let {
      code,
      outcomes
    } = req.body;
    let invalid_odd_outcome = null;

    // Set a new slipcode from Backend
    code = slipCode;

    const currentTimestamp = moment().unix();

    // TODO
    /**
     * 1. Users can only play ones per day
     *
     */

    // error handling below
    if (h.validateDuplicateFixture(outcomes)) {
      throw new Error("Fixture can not repeat");
    } else if (outcomes.length < numbersOfOutcomeToPlay) {
      throw new Error(`Selected outcomes is supposed to be ${numbersOfOutcomeToPlay}. Only ${outcomes.length} selected`);
    } else if (
      !h.validateDuplicateFixture(outcomes) &&
      outcomes.length == numbersOfOutcomeToPlay
    ) {
      let fixtureIdList = outcomes.map(function (outcome) {
        return outcome.fixtureId;
      });

      let cachedFixtureOutcomes = await h.fetchCachedOutcomes(fixtureIdList);

      /**
       * The block below is securely validating the odds of each outcome for a specific fixture id
       * Fixture outcome  data is fetched for the Redis cache
       */

      let fixtureOutcomes = [];
      let singleFixtureOutcome = null;

      for (var i = 0; i < cachedFixtureOutcomes.length; i++) {
        fixtureOutcomes[i] = JSON.parse(unescape(cachedFixtureOutcomes[i]));

        singleFixtureOutcome = fixtureOutcomes[i]
          .filter((o) => o.label_id === outcomes[i].label_id)[0]
          .values.filter((s) => s.value == outcomes[i].value);

        if (parseFloat(singleFixtureOutcome[0].odd) < lowestOdd) {
          invalid_odd_outcome = singleFixtureOutcome[0];
          invalid_odd_outcome.fixtureId = outcomes[i].fixtureId;
          invalid_odd_outcome.label_name = outcomes[i].label_name;
          invalid_odd_outcome.label_id = outcomes[i].label_id;

          //  Throw an error Flag
          throw new Error(`Fixture odd less than ${lowestOdd}`);
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
          error = `Some fixtures can no longer be selected`;

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
        userId,
        betSlipCode: code,
      });

      let outcomeData = [];

      for (var i = 0; i < outcomes.length; i++) {
        outcomeData[i] = {};

        fixtureData = await h.fetchFixtureData(
          outcomes[i].fixtureId
        );

        for (key in outcomes[i]) {
          outcomeData[i][key] = outcomes[i][key];
        }

        for (key in fixtureData) {
          outcomeData[i][key] = fixtureData[key];
        }
      }

      //   //console.log(outcomeData[0])

      outcomeData = outcomeData.map((o) => {
        return {
          oddLabelId: o.label_id,
          oddLabelName: o.label_name,
          value: o.value,
          odd: parseFloat(o.odd),
          leagueId: o.league_id,
          fixtureId: o.fixture_id,
          homeTeamId: o.homeTeam.team_id,
          awayTeamId: o.awayTeam.team_id,
          eventTimeStamp: o.event_timestamp,
          slipCode: code,
        };
      });

      if (predictionEntry) {
        let outcomeEntry = await Outcomes.bulkCreate(outcomeData);

        if (outcomeEntry) {
          error = false;
          success = true;
          return res.status(200).json({
            "message": "Prediction created successfully",
            success,
            error,
            invalid_odd_outcome,
          });
        }
      }
    } else {
      throw new Error("Nah wah for You ooh!");
    }


  } catch (err) {
    return res.json({
      message: `${err.message}`,
    }).status(403);
  }
};

// fetch outcome by bet slip code [author@clintonnzedimma]
exports.getPrediction = async (req, res) => {};

// fetch outcome by id [author@clintonnzedimma]
exports.getAllOutcomes = async (req, res) => {};

// fetch outcome by id
exports.getOutcome = async (req, res) => {};

// console.log();