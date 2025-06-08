import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import {container} from "../../../composition-root";
import {UserQueryRepository} from "../../repositories/users.queryRepository";
import {UserService} from "../../application/users.service";

const userQueryRepository = container.get(UserQueryRepository);
const userService = container.get(UserService);

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
