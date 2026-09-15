import type { QueryInterface } from 'sequelize';
import { generateID } from '../utils/idGenerator.js';

export async function up({ context }: { context: QueryInterface }) {
  const now = new Date();
  await context.bulkInsert('store_branches', [
    {
      id: generateID(),
      name: 'Main Branch',
      address: 'Address 1',
      phone_number: '+639123456789',
      status: 'closed',
      created_at: now,
      updated_at: now,
    },
    {
      id: generateID(),
      name: 'Branch 1',
      address: 'Address 2',
      phone_number: '+639123456789',
      status: 'closed',
      created_at: now,
      updated_at: now,
    },
    {
      id: generateID(),
      name: 'Branch 2',
      address: 'Address 3',
      phone_number: '+639123456789',
      status: 'closed',
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down({ context }: { context: QueryInterface }) {
  await context.bulkDelete('store_branches', {});
}