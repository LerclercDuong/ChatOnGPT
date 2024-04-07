const UserModel = require("../models/users");
const bcrypt = require("bcrypt");

module.exports = async (username, password) =>{
    let loginSuccess = false;
    //check if is user exists
    const hashPassword = await UserModel.findOne({username: username})
        .then((user) => {
            if (user) {
                return user.password;
            } else {
                return ' ';
            }
        })
        .catch((err) => {
            throw new Error('User not found');
        })
    await bcrypt.compare(password, hashPassword)
        .then(function (result) {
            if (result === true) {
                loginSuccess = true;
            }
        });
    return loginSuccess;
}