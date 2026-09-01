import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize } from 'sequelize';
import { USER_ROLE, USER_STATUS, UserRole, UserStatus } from '../constants/user.js';
import { generateID } from '../utils/idGenerator.js';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare passwordHash: string;
  declare role: CreationOptional<UserRole>;
  declare status: CreationOptional<UserStatus>;
  declare createdAt: CreationOptional<Date>;

  toSafeJSON(): SafeUser {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}

export interface SafeUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}   

export function initUser(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: 'password_hash' },
      role: { type: DataTypes.ENUM(...USER_ROLE), allowNull: false, defaultValue: 'customer' },
      status: { type: DataTypes.ENUM(...USER_STATUS), allowNull: false, defaultValue: 'active' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
    },
    { sequelize, tableName: 'users', modelName: 'User', underscored: true },
  );
  return User;
}