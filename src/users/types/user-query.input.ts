import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { UserSortField } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";

export type userQueryInput = PaginationAndSorting<UserSortField> &
  Partial<{
    searchLoginTerm: string;
    searchEmailTerm: string;
  }>;
