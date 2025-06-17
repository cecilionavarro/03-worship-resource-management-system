import { Router } from "express";
import {
    loginHandler,
    logoutHandler,
    refreshHandler,
    registerHandler,
    resetPasswordHandler,
    sendPasswordResetHandler,
    verifyEmailHandler,
} from "../controllers/auth.controllers";

const authRoutes = Router(); // makes mini express app

// prefix: /auth
authRoutes.post("/register", registerHandler); //handler is synonymous for controller
authRoutes.post("/login", loginHandler); //handler is synonymous for controller
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler)
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
