import "dotenv/config";
import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";
import cookieParser from "cookie-parser";
import authenticate from "./middleware/authenticate";
import userRoutes from "./routes/user.route";
import sessionRoutes from "./routes/session.route";

const app = express();

app.use(express.json()); //Parse JSON request bodies front end or postman
app.use(express.urlencoded({ extended: true })); // From data allows nested objects and arrays
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true, // required to send cookies or sessions
    })
);
app.use(cookieParser());

app.get("/", (req, res, next) => { 
    res.status(OK).json({
        status: "healthy",
    });
});

app.use("/auth", authRoutes) // use is for middleware
app.use("/user", authenticate, userRoutes)
app.use("/sessions", authenticate, sessionRoutes)

app.use(errorHandler); // middleware will catch errors from the routes above

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    await connectToDatabase();
});