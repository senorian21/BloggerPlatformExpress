import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { userInputDtoValidation } from "../validation/users.input-dto.validation-middlewares";
import { createUserHandler } from "./handlers/create-user";
import { deleteUserHandler } from "./handlers/delete.user";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import { getUsersListHandler } from "./handlers/get-user-list";

export const usersRouter = Router({});

usersRouter.post(
  "",
  superAdminGuardMiddleware,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  createUserHandler,
);
usersRouter.delete("/:id", superAdminGuardMiddleware, deleteUserHandler);
usersRouter.get(
  "",
  superAdminGuardMiddleware,
  paginationAndSortingValidation(),
  inputValidationResultMiddleware,
  getUsersListHandler,
);
