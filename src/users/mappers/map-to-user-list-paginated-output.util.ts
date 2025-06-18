import { WithId } from "mongodb";
import { userViewModel } from "../types/user-view-model";
import { UserEntity } from "../domain/user.entity";

export function mapToUserListPaginatedOutput(
  users: WithId<UserEntity>[],
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
      createdAt: user.createdAt, // Преобразуем Date в строку
    })),
  };
}
