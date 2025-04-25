import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { paginationAndSortingDefault } from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { userQueryInput } from "../../types/user-query.input";
import { userQueryRepository } from "../../repositories/users.queryRepository";

export async function getUsersListHandler(
    req: Request<{}, {}, {}, userQueryInput>,
    res: Response,
) {
  try {
    const queryInput: userQueryInput = {
      ...paginationAndSortingDefault,
      pageNumber:
          Number(req.query.pageNumber) || paginationAndSortingDefault.pageNumber,
      pageSize:
          Number(req.query.pageSize) || paginationAndSortingDefault.pageSize,
      sortBy: req.query.sortBy || paginationAndSortingDefault.sortBy,
      sortDirection:
          req.query.sortDirection || paginationAndSortingDefault.sortDirection,
      searchLoginTerm: req.query.searchLoginTerm || "",
      searchEmailTerm: req.query.searchEmailTerm || "",
    };
    const userListOutput = await userQueryRepository.findAllUser(queryInput);

    res.send(userListOutput);
  } catch (e) {
    console.error(e);
    res
        .status(HttpStatus.InternalServerError)
        .json({ message: "Ошибка при получении списка пользователей" });
  }
}
