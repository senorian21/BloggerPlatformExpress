import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import {
    commentsSortField
} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";

export type commentsQueryInput = PaginationAndSorting<commentsSortField> &
  Partial<{

  }>;
