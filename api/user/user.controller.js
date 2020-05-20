const User = require("../../models/connection").User;

exports.welcome = (req, res) => {
    res.send("Hey! User welcome back");
};

exports.allUser = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log("USER", users);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
    }


    // User.findAll().then(users => res.status(200).json(users)).catch(err => console.log(err));
};

exports.addUser = (req, res) => {
    User.create({
            email: "rin@gmail.com",
            username: "interneto",
            phone: "12378209212",
            password: "123abcXYZ"
        })
        .then(user => {
            res.status(200).json(user);
            console.log(user);
        })
        .catch(err => {
            res.status(404).json(err);
            console.log(err);
        });
};


// Get user by id from DB
exports.getUserbyId = async (req, res) => {
    try {
        const user = await User.findById;
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
};

exports.create = async (req, res) => {};