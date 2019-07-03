const Error = require('./error.js');

var UsersErrorType = Object.freeze({"userNotFound":1001, "invlaidUserId":1002, "userAlreadyExist":1003, 'invalidRequestBody':1004})

class UsersError extends Error{
    constructor(code, message){
        super(code, message);
        // this.type = type;
    }
}

exports.UsersError = UsersError;
exports.UsersErrorType = UsersErrorType;

