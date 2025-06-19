import { Router } from "express"
import { getUserHandler } from "../controllers/user.contoller";

const userRoutes = Router();

// prefix: /user
userRoutes.get("/", getUserHandler)

export default userRoutes