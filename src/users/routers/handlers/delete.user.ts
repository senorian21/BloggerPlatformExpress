import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { userQueryRepository, userService } from "../../../composition-root";

export async function deleteUserHandler(req: Request, res: Response) {
  const id = req.params.id;
  const user = await userQueryRepository.findUserById(id);
  if (!user) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }
  userService.deleteUser(id);
  res.sendStatus(HttpStatus.NoContent);
}
