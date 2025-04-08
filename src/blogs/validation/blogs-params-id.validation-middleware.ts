import { param } from "express-validator";
import { blogsRepositories } from "../repositories/blogs.repository";

export const idValidationBlogs = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId")
  .custom(async (id: string) => {
    const blog = await blogsRepositories.findById(id);
    if (!blog) {
      throw new Error("Blog ID not found");
    }
    return true;
  });
