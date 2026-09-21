import type { RequestHandler } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import * as productService from '../services/product.service.js'
import { Category } from '../constants/product.js';
import { newProductInput } from '../validators/product.validator.js';

export const getAllProducts: RequestHandler = asyncHandler( async (request, response) => {
  const products = await productService.getProducts(request.query.category as Category | undefined);
  response.json({ data: { products } });
})

export const getProduct: RequestHandler = asyncHandler( async (request, response) => {
  if (typeof request.params.id !== 'string') throw new ApiError(401, 'Invalid product id', 'INVALID_PRODUCT_ID');
  const product = await productService.getProduct(request.params.id);
  response.json({ data: { product } });
})

export const newProduct: RequestHandler = asyncHandler( async (request, response) => {
  if (!request.file) throw new ApiError(400, 'Product image is required', 'IMAGE_REQUIRED');
  const imageUrl = `/uploads/products/${request.file.filename}`;
  const product = await productService.newProduct(request.body as newProductInput, imageUrl);
})

