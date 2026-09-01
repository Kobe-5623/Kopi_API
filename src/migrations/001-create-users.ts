import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';
import { USER_ROLE, USER_STATUS } from '../constants/user.js';

interface MigrationContext { context: QueryInterface }

export async function up({ context }: MigrationContext): Promise<void> {
  await context.createTable('users', {
    id: { type: DataTypes.STRING(26), primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM(...USER_ROLE), allowNull: false, defaultValue: 'customer' },
    status: { type: DataTypes.ENUM(...USER_STATUS), allowNull: false, defaultValue: 'active' },
    created_at: { type: DataTypes.DATE, allowNull: false },
  });
}

export async function down({ context }: MigrationContext): Promise<void> {
  await context.dropTable('users');
}
