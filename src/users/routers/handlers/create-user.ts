import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { container } from "../../../composition-root";
import { UserQueryRepository } from "../../repositories/users.queryRepository";
import { UserService } from "../../application/users.service";

const userQueryRepository = container.get(UserQueryRepository);
const userService = container.get(UserService);

export async function createUserHandler(req: Request, res: Response) {
  const dto = req.body;
  const createdUserId = await userService.createUser(dto);

  if (!createdUserId) {
    res.status(HttpStatus.BadRequest).send({
      errorsMessages: [
        { field: "email", message: "Email already exists" },
        { field: "login", message: "Login already exists" },
      ],
    });
    return;
  }

  const createdUser = await userQueryRepository.findUserById(createdUserId);
  if (!createdUser) {
    res.sendStatus(HttpStatus.InternalServerError);
    return;
  }

  res.status(HttpStatus.Created).send(createdUser);
}
