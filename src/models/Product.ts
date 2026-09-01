import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { CATEGORY, PRODUCT_TYPE, Category, ProductType } from '../constants/product.js';
import { generateID } from '../utils/idGenerator.js';

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare category: Category;
  declare type: ProductType;
  declare description: string;
  declare price: number;
  declare isHotAvailable: CreationOptional<boolean>;
  declare isIcedAvailable: CreationOptional<boolean>;
  declare imageUrl: string
}

export function initProduct(sequelize: Sequelize): typeof Product {
  Product.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      name: { type: DataTypes.STRING(100), allowNull: false },
      category: { type: DataTypes.ENUM(...CATEGORY), allowNull: false },
      type: { type: DataTypes.ENUM(...PRODUCT_TYPE), allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
      isHotAvailable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_hot_available' },
      isIcedAvailable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_iced_available' },
      imageUrl: { type: DataTypes.STRING, allowNull: false, field: 'image_url' },
    },
    { sequelize, tableName: 'products', modelName: 'Product', underscored: true },
  );
  return Product;
}