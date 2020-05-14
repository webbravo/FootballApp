const User = require('../../models/User');

exports.welcome = (req, res) => {
    res.send("Hey! User welcome back")
}

exports.allUser = async (req, res) => {
    try {
        const users = await User.findAll;
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.error(error)
    }
};

exports.addUser = (req, res) => {
    res.status(200).send("User added!")
}


exports.create = async (req, res) => {

}