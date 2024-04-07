const jwt = require('jsonwebtoken');
const UnauthenticatedError = require('../errors/un-authenticated')
const moment = require("moment");
const {StatusCodes} = require('http-status-codes');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new Error('JWT token not found');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
        req.user = {
            userId: payload.sub
        }
        next();
    } catch {
        res.status(StatusCodes.UNAUTHORIZED).json({message: 'You are unauthorized to access this resource'})
    }
}

module.exports = auth;