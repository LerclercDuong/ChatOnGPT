const jwt = require('jsonwebtoken');
const users = require('../models/users');
const bcrypt = require('bcrypt');
const authToken = require('../middlewares/authToken');

class Authentication {
    async register(req, res, next) {
        const { username, password, email, profilePicture } = req.body;
        try {
            //check user exists before adding new user
            async function UserExists(username) {
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
            // sign and store user data to database after check 
            function sign(username, password, email, profilePicture) {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, function (err, hash_password) {
                    // Store hash in your password DB.
                    const tokenID = jwt.sign({ username: username }, 'shhhhh');
                    const password = hash_password;
                    const new_user = new users({ username, password, email, profilePicture, tokenID });
                    new_user.save();
                });
            }
            const isExist = await UserExists(username);
            // if user is not exist then sign up, otherwise return error status
            if (!isExist) {
                sign(username, password, email, profilePicture);
                res.status(200).json({ message: 'New user added'});
            } else {
                res.status(203).json({ message: 'User already exist' })
            }
        } catch (err) {
            res.status(203).send({ message: err });
        }
    }

    async login(req, res, next) {
        const { username, password } = req.body;
            try {
            //check user exists before login
            async function UserExists(username) {
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
            //check password
            async function checkPassword(password) {
                var password_correct = false;
                const hash_password = await users.findOne({ username: username })
                    .then((user) => {
                        if (user) {
                            return user.password;
                        } else {
                            return ' ';
                        }
                    })
                await bcrypt.compare(password, hash_password)
                    .then(function (result) {
                        if (result == true) {
                            password_correct = true;
                        }
                    });
                return password_correct;
            }

            //login and give user new Access Token
            async function log(username) {
                const new_tokenID = jwt.sign({
                    username: username,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60) // token with expire after 1 hour
                }, 'shhhhh');
                users.updateOne({ username: username },
                    { $set: { tokenID: new_tokenID } }
                );
                res.status(200).json({
                    message: 'Login success',
                    data: {
                        username: username,
                        tokenID: new_tokenID
                    }
                })
            }
            const isExist = await UserExists(username);
            const password_correct = await checkPassword(password);
            if (isExist && password_correct) {
                log(username);
            } else {
                throw new Error('Wrong username or password');
            }
        } catch (err) {
            res.status(203).json({ message: err.message });
        }
        
        
    }

    async forgotPassword(req, res) {

    }
}

module.exports = new Authentication;