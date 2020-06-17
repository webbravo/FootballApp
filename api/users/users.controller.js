const {
    hash,
    compare
} = require("bcryptjs");
const {
    body
} = require("express-validator");

const User = require("../../models/connection").User;
const notification = require('../notification/email');

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
            err: error.errors.message,
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
                // 4. Send Notification (Sign)
                notification.email(user.email, "signup");

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
        res.status(404).json({
            error: `${err.message}`,
        });
    }
};

// Get user by id from DB
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

exports.login = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    res.send("Login route: " + email);
};

// Check user by username
exports.findByUsername = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username,
                status: 1,
            },
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