// בס"ד
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getSheetRangeValues } from "../middleware/sheets";
import type { Project } from "../../../types/project";
import isOdd from "is-odd";
import type { Product } from "../../../types/product";
import type { UnitClass } from "../../../types/units";

export const projectsRouter = Router();

const projectNameIndex = 0;
const projectNameSlice = 1;
const itemsSlice = 1;
const itemIDID = 0;

const propsToProduct = (props: string[]): Product => {
  const idID = 0;
  const productTypeID = 1;
  const classID = 2;
  const unitTypeID = 3;
  const unitAmountID = 4;
  const stockAmountID = 5;

  return {
    id: parseInt(props[idID]),
    type: props[productTypeID],
    stock: {
      unit: {
        class: props[classID] as UnitClass,
        type: props[unitTypeID] as any,
        amount: parseInt(props[unitAmountID]),
      },
      amount: parseInt(props[stockAmountID]),
    },
  };
};

projectsRouter.get("/", async (req, res) => {
  const sheetValues = await getSheetRangeValues("פרוייקטים"); //[row][column]
  const objectValues = await getSheetRangeValues("מוצרים");

  const items = sheetValues.slice(itemsSlice);

  console.log(sheetValues);

  const projects: Project[] = items.map((row) => ({
    name: row[projectNameIndex],
    products: row
      .slice(projectNameSlice)
      .map((value, index) => {
        if (isOdd(index)) {
          return undefined;
        }

        const productProps = objectValues.find(
          (objectRow) => objectRow[itemIDID] === value
        );

        if (!productProps) {
          return undefined;
        }

        const product: Product = propsToProduct(productProps);
        return product;
      })
      .filter((value) => value !== undefined),
  }));

  res.status(StatusCodes.OK).json({
    projects,
  });
});
