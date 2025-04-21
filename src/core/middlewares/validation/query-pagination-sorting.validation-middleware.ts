import { query } from "express-validator";
import { SortDirection } from "../../types/sort-direction";
import { PaginationAndSorting } from "../../types/pagination-and-sorting";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_SORT_BY = "createdAt";

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
  pageNumber: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export enum BlogSortField {
  CreatedAt = "createdAt",
}
export enum PostSortField {
  CreatedAt = "createdAt",
}

const allowedSortFields = Object.values(BlogSortField);

export function paginationAndSortingValidation() {
  return [
    query("pageNumber")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page number must be a positive integer")
      .toInt(),

    query("pageSize")
      .optional()
      .isInt({ min: 1, max: 100000 })
      .withMessage("Page size must be between 1 and 100")
      .toInt(),

    // query("sortBy")
    //   .optional()
    //   .isIn(allowedSortFields)
    //   .withMessage(
    //     `Invalid sort field. Allowed values: ${allowedSortFields.join(", ")}`,
    //   ),

    query("sortDirection")
      .optional()
      .isIn(Object.values(SortDirection))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirection).join(", ")}`,
      ),
  ];
}
