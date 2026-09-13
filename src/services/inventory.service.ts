import { StoreBranch } from "../models/index.js";
import { InventoryItem } from "../models/InventoryItem.js";
import { InventoryItem as InventoryItemModel } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { IncrementStockInput, NewStockInput } from "../validators/inventory.validators.js";

async function assertStoreBranch(storeBranchId: string) {
  const storeBranch = await StoreBranch.findByPk(storeBranchId);
  if (!storeBranch) throw new ApiError(404, 'Invalid Store Branch Address', 'STORE_BRANCH_NOT_FOUND');
  return storeBranch;
}

async function assertInvItem(itemName: string, storeBranchId: string): Promise<InventoryItem> {
  const invItem = await InventoryItemModel.findOne({ where: { name: itemName, storeBranchId: storeBranchId } });
  if (!invItem) throw new ApiError(404, 'Inventory item not be found', 'INV_ITEM_NOT_FOUND');
  return invItem;
}

export async function newStock(storeBranchId: string, input: NewStockInput): Promise<InventoryItem> {
  const storeBranch = await assertStoreBranch(storeBranchId);

  const invItem = await InventoryItemModel.create({
    storeBranchId: storeBranch.id,
    name: input.name,
    quantity: input.quantity,
    unit: input.unit,
  });

  return invItem;
}

export async function incrementStock(storeBranchId: string, input: IncrementStockInput): Promise<InventoryItem> {
  const storeBranch = await assertStoreBranch(storeBranchId);
  const invItem = await assertInvItem(input.name, storeBranch.id);

  await invItem.increment('quantity', { by: input.quantity });

  return invItem.reload();
}

export async function decrementStock(storeBranchId: string, input: IncrementStockInput): Promise<InventoryItem> {
  const storeBranch = await assertStoreBranch(storeBranchId);
  const invItem = await assertInvItem(input.name, storeBranch.id);

  await invItem.decrement('quantity', { by: input.quantity });

  return invItem.reload();
}