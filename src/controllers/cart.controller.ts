import type { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as cartService from "../services/cart.service.js";
import { assertAuth } from "../utils/assertions.js";
import { addToCartInput } from "../validators/cart.validator.js";

export const getCart: RequestHandler = asyncHandler( async (request, response) => {
  const user = assertAuth(request.user);
  const cart = await cartService.getCart(user.id);
  response.json({ data: { cart } });
});

export const addToCart: RequestHandler = asyncHandler( async (request, response) => {
  const user = assertAuth(request.user);
  const cartItem = await cartService.addToCart(user.id, request.body as addToCartInput);
  response.json({ data: { cartItem } });
});

export const removeAddOn: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== "string") throw new ApiError( 400, "Invalid cart id", "INVALID_CART_ID" );
  await cartService.removeCart(request.params.id);
  response.status(204).send();
});