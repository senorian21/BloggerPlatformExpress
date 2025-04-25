import { WithId } from "mongodb";
import { User } from "../types/user";
import { userViewModel } from "../types/user-view-model";

export function mapToUserListPaginatedOutput(
  user: WithId<User>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: userViewModel[];
} {
  return {
    pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: user.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      login: user.login,
      createdAt: user.createdAt,
    })),
  };
}
