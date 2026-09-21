import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireRole } from "../middleware/authorization.js";

export const productRouter = Router();
productRouter.get('/', authenticate)
productRouter.get('/:category', authenticate)
