const express = require('express');
const redis = require('redis');
const axios = require('axios');


const app = express();


//
const client = redis.createClient();

// Get repos
async function getUser(user) {
    try {
        const userInfo = await axios.get(`https://api.github.com/users/${user}`);
        return userInfo ;
    } catch (error) {
      console.error(error);
    }
}




// Create a first route
app.get("/repos/:username",  async (req, res)=>{
    const username = req.params.username;
    // get user
    const response = await getUser(username);
    if(response.data !== null || undefined){

    }

    res.json(response.data);
});


// Start a running server
app.listen("3000", ()=>{
    console.log("Server running port 3000")
});

