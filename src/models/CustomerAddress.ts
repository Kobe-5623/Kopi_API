import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'; 
import { generateID } from '../utils/idGenerator.js';

export class CustomerAddress extends Model<InferAttributes<CustomerAddress>, InferCreationAttributes<CustomerAddress>> {
  declare id: CreationOptional<string>;
  declare customerId: string;
  declare address1: string;
  declare address2: string | null;
  declare barangay: string;
  declare cityMunicipality: string;
  declare province: string;
  declare postalCode: string;
  declare createdAt: CreationOptional<Date>;
}

export function initCustomerAddress(sequelize: Sequelize): typeof CustomerAddress {
  CustomerAddress.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      customerId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'customers', key: 'user_id' }, field: 'customer_id' },
      address1: { type: DataTypes.STRING, allowNull: false, field: 'address_1' },
      address2: { type: DataTypes.STRING, allowNull: true, field: 'address_2' },
      barangay: { type: DataTypes.STRING, allowNull: false },
      cityMunicipality: { type: DataTypes.STRING, allowNull: false, field: 'city_municipality' },
      province: { type: DataTypes.STRING, allowNull: false },
      postalCode: { type: DataTypes.STRING(4), allowNull: false, field: 'postal_code' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    },
    { sequelize, tableName: 'customer_addresses', modelName: 'CustomerAddress', underscored: true },
  );
  return CustomerAddress;
}
