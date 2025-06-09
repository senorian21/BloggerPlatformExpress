import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { UserQueryRepository } from "../../repositories/users.queryRepository";
import { UserService } from "../../application/users.service";

const userQueryRepository = container.get(UserQueryRepository);
const userService = container.get(UserService);

export async function deleteUserHandler(req: Request, res: Response) {
  const id = req.params.id;

  const user = await userQueryRepository.findUserById(id);
  if (!user) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  await userService.deleteUser(id);
  res.sendStatus(HttpStatus.NoContent);
  return;
}
