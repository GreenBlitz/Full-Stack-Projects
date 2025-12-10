// בס"ד

export const productTypes = ["gear", "aluminium"] as const;
export type ProductType = (typeof productTypes)[number];

interface Unit {
  type: "weight" | "length" | "area";
}

interface Stock {
  amount: number;
  unit: Unit;
}

export interface Product {
  type: ProductType;
  stock: number;
}
