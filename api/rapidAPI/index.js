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
    try {
        const id = 1383; //req.params.league_id;
        const {
            data
        } = await rapidAPIFetch.get(`/odds/league/${id}`);

        res.status(200).json(data.api)
    } catch (error) {
        console.error(err);
    }

})


const getLeagues = async (country) => {
    try {
        const year = "2020"
        const {
            data
        } = await rapidAPIFetch.get(`/leagues/country/${country}/${year}`);
        return data.api.leagues;
    } catch (error) {
        console.error(err);
    }
}

module.exports = router;