import { Router } from "express"
import { deleteSessionHandler, getSessionsHandler } from "../controllers/session.controller";

const sessionRoutes = Router();

// prefix: /sessions
sessionRoutes.get('/', getSessionsHandler);
// dynamic
sessionRoutes.delete('/:id', deleteSessionHandler);

export default sessionRoutes;