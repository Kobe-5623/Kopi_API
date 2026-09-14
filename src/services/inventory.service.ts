import { StoreBranch } from "../models/index.js";
import { InventoryItem } from "../models/InventoryItem.js";
import { InventoryItem as InventoryItemModel, StoreBranch as storeBranchModel } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { DecrementStockInput, IncrementStockInput, NewStockInput } from "../validators/inventory.validators.js";
import { Op, Sequelize } from "sequelize";
import { Unit } from "../constants/inventory.js";

type InventorySummary = {
  name: string,
  quantity: number,
  unit: Unit,
};

async function assertStoreBranch(storeBranchId: string) {
  const storeBranch = await StoreBranch.findByPk(storeBranchId);
  if (!storeBranch) throw new ApiError(404, 'Invalid Store Branch Address', 'STORE_BRANCH_NOT_FOUND');
  return storeBranch;
}

async function assertInvItem(itemId: string, storeBranchId: string): Promise<InventoryItem> {
  const invItem = await InventoryItemModel.findOne({ where: { id: itemId, storeBranchId: storeBranchId } });
  if (!invItem) throw new ApiError(404, 'Inventory item not be found', 'INV_ITEM_NOT_FOUND');
  return invItem;
}


export async function getInventory(): Promise<InventorySummary[]> {
  return await InventoryItem.findAll({
    attributes: [
      'name',
      'unit',
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'quantity'],
    ],
    group: ['name', 'unit'],
  });
}

export async function getBranchInventory(storeBranchId: string): Promise<InventoryItem[]> {
  const storeBranch = await assertStoreBranch(storeBranchId);
  return await InventoryItemModel.findAll({ where: { storeBranchId: storeBranch.id } });
}


export async function newStock(input: NewStockInput): Promise<InventoryItem[]> {
  const storeBranches = await storeBranchModel.findAll();
  if ( storeBranches.length === 0 ) throw new ApiError(404, 'No Store Branch Found.', 'NO_STORE_BRANCH__FOUND');

  const existingItems = await InventoryItemModel.findAll({ where: { name: input.name } });
  const existingBranchIds = new Set(existingItems.map(item => item.storeBranchId));
  const missingBranches = storeBranches.filter(branch => !existingBranchIds.has(branch.id));

  const newInvItem = await Promise.all(
    missingBranches.map((storeBranch) => InventoryItemModel.create({
      storeBranchId: storeBranch.id,
      name: input.name,
      unit: input.unit,
    }))
  );

  return newInvItem;
}

export async function removeStock(invItemId: string) {
  const storeBranches = await storeBranchModel.findAll();
  if ( storeBranches.length === 0 ) throw new ApiError(404, 'No Store Store Branch Found.', 'NO_STORE_BRANCH_FOUND');

  await Promise.all(
    storeBranches.map((storeBranch) => InventoryItemModel.destroy({ 
      where: { storeBranchId: storeBranch.id, id: invItemId } 
    }))
  );
}

export async function incrementStock(input: IncrementStockInput): Promise<InventoryItem[]> {
  const invItems = await InventoryItemModel.findAll({ where: { name: input.name } });
  if ( invItems.length === 0 ) throw new ApiError(404, 'Inventory item not found.', 'INV_ITEM_NOT_FOUND');

  await Promise.all(
    invItems.map((item) => item.increment('quantity', { by: input.quantity })
  ));

  return Promise.all(
    invItems.map((item) => item.reload())
  );
}

export async function decrementStock(input: DecrementStockInput): Promise<InventoryItem[]> {
  const invItems = await InventoryItemModel.findAll({ where: { name: input.name } });
  if ( invItems.length === 0 ) throw new ApiError(404, 'Inventory item not found.', 'INV_ITEM_NOT_FOUND');

  await Promise.all(
    invItems.map(item =>
      InventoryItemModel.update(
        {quantity: Sequelize.literal(`quantity - ${input.quantity}`)},
        {where: { id: item.id, quantity: { [Op.gte]: input.quantity } }}
      )
    )
  );

  return Promise.all(
    invItems.map((item) => item.reload())
  );
}



export async function newBranchStock(storeBranchId: string, input: NewStockInput): Promise<InventoryItem> {
  const storeBranch = await assertStoreBranch(storeBranchId);
  const invItem = await InventoryItemModel.findOne({ where: { storeBranchId, name: input.name } });

  if ( invItem ) {
    await invItem.increment('quantity', { by: input.quantity ?? 0 });
    return invItem.reload();
  }

  const newInvItem = await InventoryItemModel.create({
    storeBranchId: storeBranch.id,
    name: input.name,
    quantity: input.quantity,
    unit: input.unit,
  });

  return newInvItem;
}

export async function removeBranchStock(storeBranchId: string, invItemId: string) {
  const storeBranch = await assertStoreBranch(storeBranchId);
  const invItem = await assertInvItem(invItemId, storeBranch.id);

  await invItem.destroy();
}

export async function incrementBranchStock(invItemId: string, storeBranchId: string, input: IncrementStockInput): Promise<InventoryItem> {
  const storeBranch = await assertStoreBranch(storeBranchId);
  const invItem = await assertInvItem(invItemId, storeBranch.id);

  await invItem.increment('quantity', { by: input.quantity });

  return invItem.reload();
}

export async function decrementBranchStock(invItemId: string, storeBranchId: string, input: DecrementStockInput): Promise<InventoryItem> {
  const storeBranch = await assertStoreBranch(storeBranchId);
  const invItem = await assertInvItem(invItemId, storeBranch.id);

  if (input.quantity > invItem.quantity) throw new ApiError(409, 'Insufficient inventory item quantity to decrement', 'INSUFFICIENT_INV_ITEM');

  await invItem.decrement('quantity', { by: input.quantity });

  return invItem.reload();
}