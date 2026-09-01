export const CATEGORY = [
    'coffee',
    'non_coffee',
    'pastry',
    'pasta',
] as const;
export type Category = typeof CATEGORY[number];

export const PRODUCT_TYPE = [
    'drink',
    'food',
] as const;
export type ProductType = typeof PRODUCT_TYPE[number];