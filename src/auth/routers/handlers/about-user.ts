import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import {container} from "../../../composition-root";
import {UserQueryRepository} from "../../../users/repositories/users.queryRepository";

const userQueryRepository = container.get(UserQueryRepository);

export async function aboutUserHandler(req: Request, res: Response) {
  const idUser = req.user!.id;

  const user = await userQueryRepository.findUserByIdForAboutUser(idUser);

  res.status(HttpStatus.Ok).send(user);
}
