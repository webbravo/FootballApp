const {
    verify
} = require('jsonwebtoken');

const isAuth = (req, res, next) => {

    try {

        // 1. Get token for request header
        const authorization = req.headers["authorization"];


        // 2. Check if token exists
        if (!authorization) throw new Error("No token, Unathorized request");


        // 3.  Verify the token 'Bearer ksfljrewori384328289398432'
        const token = authorization.split(' ')[1];
        const {
            userId
        } = verify(token, process.env.ACCESS_TOKEN_SECRET);


        // 4. Check if token is valid
        if (!verify(token, process.env.ACCESS_TOKEN_SECRET)) {
            res.json({
                error: "Token is not valid"
            }).status(401);
        };

        // 5. Send User from payload
        req.userId = userId;

        next();

    } catch (err) {
        res.json({
            error: `${err.message}`
        }).status(401);
    }
};

module.exports = {
    isAuth,
};