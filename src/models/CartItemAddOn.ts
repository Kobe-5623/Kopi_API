import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class CartItemAddOn extends Model<InferAttributes<CartItemAddOn>, InferCreationAttributes<CartItemAddOn>> {
  declare cartItemId: string;
  declare addOnId: string;
}

export function initCartItemAddOn(sequelize: Sequelize): typeof CartItemAddOn {
  CartItemAddOn.init(
    {
      cartItemId: { type: DataTypes.STRING(26), references: { model: 'cart_items', key: 'id' }, primaryKey: true, field: 'cart_item_id' },
      addOnId: { type: DataTypes.STRING(26), references: { model: 'add_ons', key: 'id' }, primaryKey: true, field: 'add_on_id' },
    },
    { sequelize, tableName: 'cart_item_add_ons', modelName: 'CartItemAddOn', underscored: true },
  );
  return CartItemAddOn;
}
