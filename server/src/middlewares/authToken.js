const jwt = require('jsonwebtoken');

module.exports = function authToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        // No token found, move to the next middleware
        console.log("No token found");
        next();
    } else {
        try {
            jwt.verify(token, 'shhhhh', function (err, decoded) {
                if (err) {
                    res.status(200).json("Invalid token");
                } else {
                    res.status(200).json(decoded);
                }
            });
        } catch (e) {
            console.log("Error while verifying token");
            next(); // Pass the error to the next middleware for error handling
        }
    }
};
