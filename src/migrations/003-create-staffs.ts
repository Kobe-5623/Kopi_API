import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('staffs', {
    user_id: { type: DataTypes.STRING(26), references: { model: 'users', key: 'id' }, primaryKey: true },
    store_branch_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' } },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('staffs');
}
