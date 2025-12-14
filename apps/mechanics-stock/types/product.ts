// בס"ד

import type { Unit } from "./units";

export const productTypes = ["gear", "aluminium"] as const;
export type ProductType = (typeof productTypes)[number] | (string & {});

export interface Stock {
  amount: number;
  unit: Unit;
}

export interface Product {
  type: ProductType;
  stock: number;
  id: number;
}
