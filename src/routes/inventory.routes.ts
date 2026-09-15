import { Router } from "express";
import { authenticate } from '../middleware/authenticate.js';
import { validateBody } from "../middleware/validate.js";
import { decrementStockSchema, incrementStockSchema, newStockSchema } from "../validators/inv.validators.js";
import { requireRole } from "../middleware/authorization.js";

export const invRouter = Router();
invRouter.get('/', authenticate, requireRole('owner'));
invRouter.post('/', authenticate, requireRole('owner'), validateBody(newStockSchema));
invRouter.delete('/:name', authenticate, requireRole('owner'));
invRouter.patch('/:name/increment', authenticate, requireRole('owner'), validateBody(incrementStockSchema));
invRouter.patch('/:name/decrement', authenticate, requireRole('owner'), validateBody(decrementStockSchema));

invRouter.get('/branches/:storeBranchId', authenticate, requireRole('owner', 'staff'));
invRouter.post('/branches/:storeBranchId', authenticate, requireRole('owner', 'staff'), validateBody(newStockSchema));
invRouter.delete('/items/:invItemId', authenticate, requireRole('owner', 'staff'));
invRouter.patch('/items/:invItemId/increment', authenticate, requireRole('owner', 'staff'), validateBody(incrementStockSchema));
invRouter.patch('/items/:invItemId/decrement', authenticate, requireRole('owner', 'staff'), validateBody(decrementStockSchema));