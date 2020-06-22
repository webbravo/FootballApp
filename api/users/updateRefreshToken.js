const User = require("../../models/connection").User;


module.exports = (token, userId) => {
    User.update({
        "refreshtoken": token
    }, {
        where: {
            id: userId
        }
    });
}