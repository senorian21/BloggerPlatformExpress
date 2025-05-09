import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../application/auth.service";
import { userQueryRepository } from "../../../users/repositories/users.queryRepository";

export async function aboutUserHandler(req: Request, res: Response) {
  const idUser = req.user!.id;

  const user = await userQueryRepository.findUserByIdForAboutUser(idUser);

  res.status(HttpStatus.Ok).send(user);
}
