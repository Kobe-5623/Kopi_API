import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import {
  FULFILLMENT_TYPE,
  PAYMENT_METHOD,
  ORDER_STATUS,
  FulfillmentType,
  PaymentMethod,
  OrderStatus,
} from '../constants/order.js';
import { generateID } from '../utils/idGenerator.js';

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<string>;
  declare customerId: string | null;
  declare customerAddress: string | null;
  declare storeBranchId: string;
  declare fulfillmentType: CreationOptional<FulfillmentType>;
  declare paymentMethod: CreationOptional<PaymentMethod>;
  declare paymentReference: string | null;
  declare notes: string | null;
  declare deliveryFee: number | null;
  declare status: CreationOptional<OrderStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initOrder(sequelize: Sequelize): typeof Order {
  Order.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      customerId: { type: DataTypes.STRING(26), allowNull: true, references: { model: 'customers', key: 'user_id' }, field: 'customer_id' },
      customerAddress: { type: DataTypes.STRING, allowNull: true, field: 'customer_address' },
      storeBranchId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' }, field: 'store_branch_id' },
      fulfillmentType: { type: DataTypes.ENUM(...FULFILLMENT_TYPE), allowNull: false, defaultValue: 'walk_in' },
      paymentMethod: { type: DataTypes.ENUM(...PAYMENT_METHOD), allowNull: false, defaultValue: 'cash' },
      paymentReference: { type: DataTypes.STRING(30), allowNull: true, field: 'payment_reference' },
      notes: { type: DataTypes.STRING, allowNull: true },
      deliveryFee: { type: DataTypes.DECIMAL(8, 2), allowNull: true, field: 'delivery_fee' },
      status: { type: DataTypes.ENUM(...ORDER_STATUS), allowNull: false, defaultValue: 'pending' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    },
    { sequelize, tableName: 'orders', modelName: 'Order', underscored: true },
  );
  return Order;
}
