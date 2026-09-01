import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'; 
import { generateID } from '../utils/idGenerator.js';

export class CartItem extends Model<InferAttributes<CartItem>, InferCreationAttributes<CartItem>> {
  declare id: CreationOptional<string>;
  declare customerId: string;
  declare productId: string;
  declare quantity: number;
}

export function initCartItem(sequelize: Sequelize): typeof CartItem {
  CartItem.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      customerId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'customers', key: 'id' }, field: 'customer_id' },
      productId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'products', key: 'id' }, field: 'product_id' },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, tableName: 'cart_items', modelName: 'CartItem', underscored: true },
  );
  return CartItem;
}