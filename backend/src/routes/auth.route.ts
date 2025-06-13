import { Router } from "express";
import { registerHandler } from "../controllers/auth.controllers";

const authRoutes = Router();

// prefix: /auth

authRoutes.post("/register", registerHandler) //handler is synonymous for controller

export default authRoutes