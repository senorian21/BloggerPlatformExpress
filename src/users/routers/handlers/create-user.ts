import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { userQueryRepository, userService } from "../../../composition-root";

export async function createUserHandler(req: Request, res: Response) {
  const createdUserId = await userService.createUserByAdmin(req.body);
  if (!createdUserId) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  } else if (!createdUserId) {
    res.status(HttpStatus.BadRequest).json({
      errorsMessages: [
        { field: "email or login", message: "email or login is not correct" },
      ],
    });
  }
  const createdUser = await userQueryRepository.findUserById(createdUserId);

  res.status(HttpStatus.Created).send(createdUser);
}
