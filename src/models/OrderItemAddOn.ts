import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class CartItemAddOn extends Model<InferAttributes<CartItemAddOn>, InferCreationAttributes<CartItemAddOn>> {
  declare orderItemId: string;
  declare addOnId: string;
  declare unitPrice: number;
}

export function initCartItemAddOn(sequelize: Sequelize): typeof CartItemAddOn {
  CartItemAddOn.init(
    {
      orderItemId: { type: DataTypes.STRING(26), references: { model: 'order_items', key: 'id' }, primaryKey: true, field: 'cart_item_id' },
      addOnId: { type: DataTypes.STRING(26), references: { model: 'add_ons', key: 'id' }, primaryKey: true, field: 'add_on_id' },
      unitPrice: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    },
    { sequelize, tableName: 'cart_item_add_ons', modelName: 'CartItemAddOn', underscored: true },
  );
  return CartItemAddOn;
}
