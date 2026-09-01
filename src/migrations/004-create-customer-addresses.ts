import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('customer_addresses', {
    id: { type: DataTypes.STRING(26), primaryKey: true },
    customer_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'customers', key: 'user_id' } },
    address_1: { type: DataTypes.STRING, allowNull: false },
    address_2: { type: DataTypes.STRING, allowNull: true },
    barangay: { type: DataTypes.STRING, allowNull: false },
    city_municipality: { type: DataTypes.STRING, allowNull: false },
    province: { type: DataTypes.STRING, allowNull: false },
    postal_code: { type: DataTypes.STRING(4), allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('customer_addresses');
}
