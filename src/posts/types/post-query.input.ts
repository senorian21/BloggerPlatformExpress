import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { PostSortField } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";

export type PostQueryInput = PaginationAndSorting<PostSortField> & Partial<{}>;
