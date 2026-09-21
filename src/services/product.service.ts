import { Sequelize } from "sequelize";
import { ApiError } from "../utils/ApiError.js";
import { Product as ProductModel } from "../models/index.js";
import { newProductInput, updateProductInput } from "../validators/product.validator.js";
import { Category } from "../constants/product.js";

export async function getProducts(category?: Category) {
  const products = await ProductModel.findAll({...(category !== undefined && { where: { category } })});
  if (products.length === 0) throw new ApiError(404, 'No product found', 'NO_PRODUCT_FOUND');
  return products;
}

export async function getProduct(id: string) {
  const product = await ProductModel.findByPk(id);
  if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
  return product;
}

export async function newProduct(input: newProductInput, imageUrl: string) {
  return ProductModel.create({
    name: input.name,
    category: input.category,
    description: input.description,
    price: input.price,
    isHotAvailable: input.isHotAvailable,
    isIcedAvailable: input.isIcedAvailable,
    imageUrl,
  });
}

export async function removeProduct(id: string) {
  const deleted = await ProductModel.destroy({ where: { id } });
  if (deleted === 0) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
}

export async function updateProduct(id: string, input: updateProductInput, imageUrl?: string) {
  const product = await ProductModel.findByPk(id);
  if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
  
  if (input.name !== undefined) product.name = input.name;
  if (input.category !== undefined) product.category = input.category;
  if (input.description !== undefined) product.description = input.description;
  if (input.price !== undefined) product.price = input.price;
  if (input.isHotAvailable !== undefined) product.isHotAvailable = input.isHotAvailable;
  if (input.isIcedAvailable !== undefined) product.isIcedAvailable = input.isIcedAvailable;
  if (imageUrl !== undefined) product.imageUrl = imageUrl;

  return product.save();
}




