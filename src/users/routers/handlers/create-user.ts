import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { userService } from "../../application/users.service";
import { userQueryRepository } from "../../repositories/users.queryRepository";

export async function createUserHandler(req: Request, res: Response) {
  const createdUserId = await userService.createUser(req.body);
  if (!createdUserId) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  } else if (createdUserId === "email or login") {
    res.status(HttpStatus.BadRequest).json({
      errorsMessages: [
        { field: "email or login", message: "email or login is not correct" },
      ],
    });
  }
  const createdUser = await userQueryRepository.findUserById(createdUserId);

  res.status(HttpStatus.Created).send(createdUser);
}
