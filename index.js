const app = require('./app');

// import environmental variables from our variables.env file
require('dotenv').config({
    path: '.env'
});


app.set('port', process.env.PORT || 8600);
const server = app.listen(app.get('port'), () => {
    console.debug(`Express Server → PORT http://127.0.0.1:${server.address().port}`);
});