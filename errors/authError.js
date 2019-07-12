const Error = require('./error.js');

var AuthErrorType = Object.freeze({"invalidUsernamePassword":1001, "incorrectNamePassword":1002})

class AuthError extends Error{
    constructor(code, message){
        super(code, message);
        // this.type = type;
    }
}

exports.AuthError = AuthError;
exports.AuthErrorType = AuthErrorType;

