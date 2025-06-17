import AppErrorCode from "../constants/appErrorCode";
import { HttpStatusCode } from "../constants/http";

/*
    constructor () must be used when using ... extends ..., it is used to pass in the arguments
    optional in a regular class declaration

    Here is the code in JavaScript

    const AppErrorCode = require("../constants/appErrorCode");
    const { HttpStatusCode } = require("../constants/http");

    class AppError extends Error {
        constructor(statusCode, message, errorCode) {
            super(message);
            this.statusCode = statusCode;
            this.message = message;
            this.errorCode = errorCode;
        }
    }

    module.exports = AppError;
*/

class AppError extends Error {
    constructor(
        public statusCode: HttpStatusCode,
        public message: string,
        public errorCode?: AppErrorCode
    ) {
        super(message);
    }
}

export default AppError;
