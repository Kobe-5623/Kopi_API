import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { UNIT, Unit } from '../constants/inventory.js';
import { generateID } from '../utils/idGenerator.js';

export class InventoryItem extends Model<InferAttributes<InventoryItem>, InferCreationAttributes<InventoryItem>> {
  declare id: CreationOptional<string>;
  declare storeBranchId: string;
  declare name: string;
  declare quantity: number;
  declare unit: Unit;
}

export function initInventoryItem(sequelize: Sequelize): typeof InventoryItem {
  InventoryItem.init(
    {
      id: { type: DataTypes.STRING(26), primaryKey: true, defaultValue: generateID },
      storeBranchId: { type: DataTypes.STRING(26), allowNull: false, references: { model: 'store_branches', key: 'id' }, field: 'branch_id' },
      name: { type: DataTypes.STRING(100), allowNull: false },
      quantity: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
      unit: { type: DataTypes.ENUM(...UNIT), allowNull: false },
    },
    { sequelize, tableName: 'inventory_items', modelName: 'InventoryItem', underscored: true },
  );
  return InventoryItem;
}