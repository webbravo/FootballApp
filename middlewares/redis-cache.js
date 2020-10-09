// Use a Redis to Store data
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);


exports.set = (data) => {
    // Set data to Redis
    client.setex(data.key, 3600 * 24, JSON.stringify(data.data));
    return;
}


exports.get = (req, res, next) => {

    const todayDate = moment().format("YYYY-MM-DD");

    const {
        id,
        country,
        league_id,
        fixture_id
    } = req.params;

    client.get(id || country || league_id || fixture_id || todayDate, (err, payload) => {
        if (err) throw err;

        if (payload !== null) {
            res.status(202).json(JSON.parse(payload));
        } else {
            next();
        }
    });

}