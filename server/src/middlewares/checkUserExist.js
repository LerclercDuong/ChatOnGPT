const users = require('../models/users');

checkUserExist = async (username) => {
    var isValid = false;
    // find in database
    await users.findOne({ username: username })
        .then(function (user) {
            if (user) {
                isValid = true;
            }
        })
    return isValid;
}