const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const authHeader = req.header.authorization;
    if (!token || !token.startsWith('Bearer')) {
        throw new Error('JWT token not found');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    } catch {

    }
}