import type { RequestHandler } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import * as invService from '../services/inv.service.js';
import type { NewStockInput, IncrementStockInput, DecrementStockInput } from '../validators/inv.validators.js';

export const newStockToAll: RequestHandler = asyncHandler(async (request, response) => {
    await invService.newStock(request.body as NewStockInput);
    response.status(204).send();
});

export const removeStockToAll: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.name !== 'string') throw new ApiError(400, 'Invalid stock name', 'INVALID_STOCK_NAME');
    await invService.removeStock(request.params.name);
    response.status(204).send();
});

export const incrementStockToAll: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.name !== 'string') throw new ApiError(400, 'Invalid stock name', 'INVALID_STOCK_NAME');
    await invService.incrementStock(request.params.name, request.body as IncrementStockInput);
    response.status(204).send();
})

export const decrementStockToAll: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.name !== 'string') throw new ApiError(400, 'Invalid stock name', 'INVALID_STOCK_NAME');
    await invService.decrementStock(request.params.name, request.body as DecrementStockInput);
    response.status(204).send();
})


export const newStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.storeBranchId !== 'string') throw new ApiError(400, 'Invalid store branch id', 'INVALID_STORE_BRANCH_ID');
    await invService.newBranchStock(request.params.storeBranchId , request.body as NewStockInput);
    response.status(204).send();
})

export const removeStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.invItemId !== 'string') throw new ApiError(400, 'Invalid stock id', 'INVALID_STOCK_ID');
    await invService.removeBranchStock(request.params.invItemId);
    response.status(204).send();
});

export const incrementStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.invItemId !== 'string') throw new ApiError(400, 'Invalid stock id', 'INVALID_STOCK_ID');
    await invService.incrementBranchStock(request.params.invItemId, request.body as IncrementStockInput);
    response.status(204).send();
});

export const decrementStockToBranch: RequestHandler = asyncHandler(async (request, response) => {
    if (typeof request.params.invItemId !== 'string') throw new ApiError(400, 'Invalid stock id', 'INVALID_STOCK_ID');
    await invService.decrementBranchStock(request.params.invItemId, request.body as DecrementStockInput);
    response.status(204).send();
});