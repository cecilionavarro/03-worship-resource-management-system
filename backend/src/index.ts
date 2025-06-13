import "dotenv/config";
import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json()); //Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // From data allows nested objects and arrays
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true, // required to send cookies or sessions
    })
);

app.get("/", (req, res, next) => { 
    res.status(OK).json({
        status: "healthy",
    });
});

app.use("/auth", authRoutes)

app.use(errorHandler); // middleware will catch errors from the routes above

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    await connectToDatabase();
});
