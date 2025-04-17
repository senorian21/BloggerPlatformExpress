import { query } from "express-validator";
import { SortDirection } from "../../types/sort-direction";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

export enum BlogSortField {
  CreatedAt = "createdAt",
}

const allowedSortFields = Object.values(BlogSortField);

export function paginationAndSortingValidation<T extends string>() {
  return [
    query("pageNumber")
        .optional()
        .default(DEFAULT_PAGE)
        .isInt({ min: 1 })
        .withMessage("Page number must be a positive integer")
        .toInt(),

  query("pageSize")
      .optional()
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage("Page size must be between 1 and 100")
      .toInt(),

  query("sortBy")
      .optional()
      .default(allowedSortFields[0])
      .isIn(allowedSortFields)
      .withMessage(
          `Invalid sort field. Allowed values: ${allowedSortFields.join(", ")}`,
      ),

  query("sortDirection")
      .optional()
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(
          `Sort direction must be one of: ${Object.values(SortDirection).join(", ")}`,
      )
  ]

}
