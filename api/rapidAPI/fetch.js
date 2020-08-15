const axios = require('axios');

const rapidAPIFetch = axios.create({
    baseURL: process.env.RAPID_API_URL,
    timeout: 5000,
    headers: {
        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY
    }
});


module.exports = {
    rapidAPIFetch
};