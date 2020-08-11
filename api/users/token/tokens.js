const {
    sign
} = require('jsonwebtoken');

// Create tokens
// ----------------------------------
const createAccessToken = user => {
    return sign({
        sub: user._id,
        email: user.email,
        role: user.role,
        iss: 'api.10dPredict',
        aud: 'api.10dPredict'
    }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '30m',
    });
};

const createRefreshToken = user => {
    return sign({
        sub: user._id,
        email: user.email,
        role: user.role,
        iss: 'api.10dPredict',
        aud: 'api.10dPredict'
    }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '7d',
    });

};

// Send tokens
// ----------------------------------
const sendAccessToken = (res, email, accessToken) => {
    res.send({
        accessToken,
        email
    });
};

const sendRefreshToken = (res, refreshtoken) => {
    res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        path: '/refresh_token',
    });
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
};