import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { BlogSortField } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";

export type BlogsQueryInput = PaginationAndSorting<BlogSortField> &
  Partial<{
      searchNameTerm: string;
  }>;
