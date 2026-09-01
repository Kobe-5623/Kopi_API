import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize'; 

export class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
	declare userId: string;
  declare phoneNumber: string;
}

export function initCustomer(sequelize: Sequelize): typeof Customer {
	Customer.init(
		{
			userId: { type: DataTypes.STRING(26), references: { model: 'users', key: 'id' }, primaryKey: true, field: 'user_id' },
			phoneNumber: { type: DataTypes.STRING(11), allowNull: false, field: 'phone_number' },
		},
		{ sequelize, tableName: 'customers', modelName: 'Customer', underscored: true },
	);
	return Customer;
}