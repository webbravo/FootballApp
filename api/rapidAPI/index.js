const {
    rapidAPIFetch
} = require("./fetch");
const express = require("express");
const router = express.Router();
const countries = require('./countryList');

router.get("/countries", async (req, res) => {
    try {

        const leagues = await getLeagues("England");

        res.json({
            countries,
            leagues
        });

        // Cache Countries list
    } catch (err) {
        console.error(err);
    }
});


router.get("/leagues/:country", async (req, res) => {
    // Check if it exist in REDIS Cache
    const leagues = await getLeagues(req.params.country);
    res.status(200).json(leagues);
});

router.get("/odds/league/:league_id", async (req, res) => {
    const id = 1383; //req.params.league_id;

    const {
        data
    } = await rapidAPIFetch.get(`/odds/league/${id}`);

    res.status(200).json(data.api)

})


const getLeagues = async (country) => {
    const year = "2020"
    const {
        data
    } = await rapidAPIFetch.get(`/leagues/country/${country}/${year}`);
    return data.api.leagues;
}

module.exports = router;