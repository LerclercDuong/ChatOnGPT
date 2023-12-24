const { StatusCodes } = require('http-status-codes');
const CustomError = require('./custom-errors');

class UnauthenticatedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError;