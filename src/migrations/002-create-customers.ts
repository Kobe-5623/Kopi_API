import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('customers', {
    user_id: { type: DataTypes.STRING(26), references: { model: 'users', key: 'id' }, primaryKey: true },
    phone_number: { type: DataTypes.STRING(11), allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('customers');
}
