import { sequelize } from '../config/database.js';
import { initUser } from './User.js';
import { initCustomer } from './Customer.js';
import { initStaff } from './Staff.js';
import { initCustomerAddress } from './CustomerAddress.js';
import { initStoreBranch } from './StoreBranch.js';

export const User = initUser(sequelize);
export const Customer = initCustomer(sequelize);
export const Staff = initStaff(sequelize);
export const CustomerAddress = initCustomerAddress(sequelize);
export const StoreBranch = initStoreBranch(sequelize);

User.hasOne( Customer, { foreignKey: 'userId' } );
User.hasOne( Staff, { foreignKey: 'userId' } );
Customer.belongsTo( User, { foreignKey: 'userId' } );
Customer.hasMany( CustomerAddress, { foreignKey: 'customerId' } );
CustomerAddress.belongsTo( Customer, { foreignKey: 'customerId' } )
Staff.belongsTo( User, { foreignKey: 'userId' } );
Staff.belongsTo( StoreBranch, { foreignKey: 'storeBranchId' } );
StoreBranch.hasMany( Staff, { foreignKey: 'storeBranchId' } );

export { sequelize };