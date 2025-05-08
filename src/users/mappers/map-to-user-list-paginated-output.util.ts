import { WithId } from "mongodb";
import { User } from "../types/user";
import { userViewModel } from "../types/user-view-model";

export function mapToUserListPaginatedOutput(
  users: WithId<User>[],
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
    items: users.map((user) => ({
      id: user._id.toString(), // Преобразуем ObjectId в строку
      email: user.email,
      login: user.login,
      createdAt: user.createdAt.toISOString(), // Преобразуем Date в строку
    })),
  };
}
