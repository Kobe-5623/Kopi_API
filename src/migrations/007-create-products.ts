import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';
import { CATEGORY, PRODUCT_TYPE } from '../constants/product.js';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('products', {
    id: { type: DataTypes.STRING(26), primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    category: { type: DataTypes.ENUM(...CATEGORY), allowNull: false },
    type: { type: DataTypes.ENUM(...PRODUCT_TYPE), allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    is_hot_available: { type: DataTypes.BOOLEAN, allowNull: false },
    is_iced_available: { type: DataTypes.BOOLEAN, allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('products');
}