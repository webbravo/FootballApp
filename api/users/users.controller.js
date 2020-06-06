const User = require("../../models/connection").User;
const {
    body
} = require("express-validator");

exports.welcome = (req, res) => {
    res.send("Hey! User welcome back");
};

exports.all = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                status: 1
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({
            "err": error.errors.message
        });
    }
};

exports.create = (req, res) => {

    const user = req.body;

    User.create(user)
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((err) => {
            res.status(404).json({
                [err.fields]: {
                    "message": err.errors[0].message,
                    "value": err.errors[0].value
                }
            })

        });

};

// Get user by id from DB
exports.findById = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id,
                status: 1
            }
        });
        console.log(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};


// Check user by username
exports.findByUsername = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username,
                status: 1
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
}

exports.update = async (req, res) => {
    try {
        const user = await User.update(req.body , {
            returning: true,
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
}

exports.delete = async (req, res) => {
    try {
        const user = await User.update({status: 0}, {
            returning: true,
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({message: "Deleted"});
    } catch (error) {
        console.error(error);
    }
};



exports.create = async (req, res) => {};