import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';
import { UNIT } from '../constants/inventory.js';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('inventory_items', {
    id: { type: DataTypes.STRING(26), primaryKey: true },
    store_branch_id: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' } },
    quantity: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    unit: { type: DataTypes.ENUM(...UNIT), allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('inventory_items');
}