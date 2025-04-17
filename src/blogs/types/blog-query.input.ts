import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { DriverSortField } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";

export type BlogsQueryInput = PaginationAndSorting<DriverSortField> &
  Partial<{
    searchBlogNameTerm: string;
  }>;
