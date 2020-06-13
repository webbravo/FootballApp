// Use a Redis to Store data
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);


exports.set = (data) => {
    // Set data to Redis
    client.setex(data.key, 3600, JSON.stringify(data.matches));
    return;
}


exports.get = (req, res, next) => {

    const todayDate = moment().format("YYYY-MM-DD");

    const {
        id
    } = req.params;

    client.get(id || todayDate, (err, matches) => {
        if (err) throw err;

        if (matches !== null) {
            res.status(202).json(JSON.parse(matches));
        } else {
            next();
        }
    });

}