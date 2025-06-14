import { Router } from "express";
import { loginHandler, registerHandler } from "../controllers/auth.controllers";

const authRoutes = Router();

// prefix: /auth

authRoutes.post("/register", registerHandler) //handler is synonymous for controller
authRoutes.post("/login", loginHandler) //handler is synonymous for controller

export default authRoutes