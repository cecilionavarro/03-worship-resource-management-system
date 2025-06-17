import assert from "node:assert";
import AppError from "./AppError";
import { HttpStatusCode } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";
// Asserts a condition and throws an AppError if the condition is falsy

// assert(condition, message) - message can be a string or object error
// assert(condition) - means if condition is false, thow an error

/*
    in JavaScript
    import assert from "node:assert";
    import AppError from "./AppError";

    // appAssert checks if a condition is true.
    // If not, it throws an AppError with a status code and message.
    const appAssert = (condition, httpStatusCode, message, appErrorCode) => {
    assert(condition, new AppError(httpStatusCode, message, appErrorCode));
    };

    export default appAssert;
*/

type AppAssert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode
    // if we throw an error it means a user with this email must already exist for asserts condition
    // if void it'll say user possibly null
) => asserts condition;

// saying it should match the assert type
const appAssert: AppAssert = (
    condition,
    httpStatusCode,
    message,
    appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
