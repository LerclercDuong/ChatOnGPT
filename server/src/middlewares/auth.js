const jwt = require('jsonwebtoken');
const UnauthenticatedError = require('../errors/un-authenticated')

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader|| !authHeader.startsWith('Bearer')) {
        throw new Error('JWT token not found');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = {
            userId: payload.userId,
            username: payload.username
        }
        next();
    } catch {
        throw new UnauthenticatedError('Unauthorized');
    }
}

module.exports = auth;