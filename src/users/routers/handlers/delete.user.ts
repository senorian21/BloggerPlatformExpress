import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { UserQueryRepository } from "../../repositories/users.queryRepository";
import { UserService } from "../../application/users.service";

const userService = container.get(UserService);

export async function deleteUserHandler(req: Request, res: Response) {
  const id = req.params.id;

  const deleteUser = await userService.deleteUser(id);
  if (!deleteUser) {
    res.sendStatus(HttpStatus.NotFound);
  }

  res.sendStatus(HttpStatus.NoContent);
  return;
}
