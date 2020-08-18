const {
    hash,
    compare
} = require("bcryptjs");

const {
    body
} = require("express-validator");

const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
    sendAccessToken,
} = require("./token/tokens");

const jwtDecode = require("jwt-decode");
const User = require("../../models/connection").User;
const notification = require("../notification/email");
const updateRefreshToken = require("./updateRefreshToken");

exports.welcome = (req, res) => {
    res.send("Hey! User welcome back");
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
            "err": error.message
        });
    }
};

const checkForUsers = async (email) => {
    try {
        const user = await User.findOne({
            where: {
                email,
            },
        });
        return !user.dataValues ? false : true;
    } catch (error) {
        console.error(error);
    }
};

exports.create = async (req, res) => {
    const user = req.body;

    try {
        // 1. Check if user already exists
        if ((await checkForUsers(user.email)) === true)
            throw new Error("User already exist");

        // 2. Hash password
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;

        // 3. Insert into Database
        User.create(user)
            .then((user) => {
                // 4. Se nd Notification (Sign)
                //    notification.email(user.email, "signup");
                res.status(200).send(user);
            })
            .catch((err) => {
                res.status(404).json({
                    [err.fields]: {
                        message: err.errors[0].message,
                        value: err.errors[0].value,
                    },
                });
            });
    } catch (err) {
        res.status(400).json({
            error: `${err.message}`,
        });
    }
};

// Get user by ID
exports.findById = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id,
                status: 1,
            },
        });
        console.log(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};


// Get protected user
exports.findByIdP = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.userId,
                status: 1,
            },
        });
        console.log(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};



//  Authenticate a user
exports.authenticate = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // 0. Check if Email and password was entered
        if (!email || !password)
            throw new Error('Enter Email address and Password');

        // 1. Find user in array. If not exist send error
        // (TODO: Email address and Password Incorret )
        const user = await findByEmail(email);
        if (!user) {
            return res.status(403).json({
                message: "Wrong email or password.",
            });
        };

        // 2. Compare encrypted password and see if it checks out. Send error if not
        const valid = await compare(password, user.password);
        if (!valid) {
            return res.status(403).json({
                message: "Password not correct",
            });
        };

        // 3. Create Refresh-and Accesstoken
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        // 4. Update the Refresh Token in the database
        updateRefreshToken("refreshToken", user.id)

        // 5. Send token. AcessToken as cookie
        res.cookie("token", token, {
            httpOnly: true
        });

        // 6. Response to the API with user data
        res.json({
            "message": "Authentication successful!",
            "token": accessToken,
            "userInfo": user,
            "expiresAt": jwtDecode(accessToken).exp,
        }).status(200);


    } catch (err) {
        res.status(403).json({
            error: `${err.message}`
        });
    }
};


// 3. Logout a user
exports.logout = (req, res) => {
    res.clearCookie('refreshtoken', {
        path: '/refresh_token'
    });

    // Logic here for also remove refreshtoken from db

    return res.send({
        message: 'Logged out',
    });
};


// find User by email address
const findByEmail = async (email) => {

    try {
        const user = await User.findOne({
            where: {
                email: email,
                status: 1,
            },
        });

        if (!user) {
            return false;
        }


        return user;

    } catch (err) {
        console.error(err);
    }
};

exports.protected = async (req, res) => {
    try {
        if (req.userId !== null) {
            res.json({
                "name": req.body.name = "Peak Milk"
            });
        }

    } catch (err) {
        res.send({
            error: `${err.message}`,
        });
    }
}

// Check user by username
exports.findByUsername = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username,
                status: 1,
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.update(req.body, {
            returning: true,
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};

exports.delete = async (req, res) => {
    try {
        const user = await User.update({
            status: 0,
        }, {
            returning: true,
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({
            message: "Deleted",
        });
    } catch (error) {
        console.error(error);
    }
};


exports.refreshtoken = async (req, res) => {
    const token = req.cookies.refreshtoken;
    // If we don't have a token in our request
    if (!token) return res.send({
        accesstoken: ''
    });
    // We have a token, let's verify it!
    let payload = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return res.send({
            accesstoken: ''
        });
    }

    // token is valid, check if user exist
    const user = await this.findById(payload.userId)
    if (!user) return res.send({
        accesstoken: ''
    });


    // user exist, check if refreshtoken exist on user
    if (user.refreshToken !== token)
        return res.send({
            accesstoken: ''
        });

    // token exist, create new Refresh- and accesstoken
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);

    //  Update the Refresh Token in the database
    updateRefreshToken(refreshtoken, user.id)

    // All good to go, send new refreshtoken and accesstoken
    sendRefreshToken(res, refreshtoken);
    return res.send({
        accesstoken
    });


};