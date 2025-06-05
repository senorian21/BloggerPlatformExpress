import { BlogsRepositories } from "./blogs/repositories/blogs.repository";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsQueryRepositories } from "./blogs/repositories/blogs.queryRepository";
import { PostsRepository } from "./posts/repositories/posts.repository";
import { PostsQueryRepository } from "./posts/repositories/posts.queryRepository";
import { PostsService } from "./posts/application/posts.service";
import { UserQueryRepository } from "./users/repositories/users.queryRepository";
import { CommentsRepositories } from "./comments/repositories/comments.Repository";
import { CommentsService } from "./comments/application/comments.service";
import { Argon2Service } from "./auth/adapters/argon2.service";
import { UserRepository } from "./users/repositories/users.repository";
import { UserService } from "./users/application/users.service";
import { AuthRepositories } from "./auth/repositories/auth.Repository";
import { NodemailerService } from "./auth/adapters/nodemailer.service";
import { JwtService } from "./auth/adapters/jwt.service";
import { AuthService } from "./auth/application/auth.service";
import { SecurityService } from "./security/application/security.service";

export const blogsRepositories = new BlogsRepositories();
export const postsRepository = new PostsRepository();
export const blogsQueryRepositories = new BlogsQueryRepositories();
export const postsQueryRepository = new PostsQueryRepository();
export const userQueryRepository = new UserQueryRepository();
export const commentsRepositories = new CommentsRepositories();
export const argon2Service = new Argon2Service();
export const userRepository = new UserRepository();
export const authRepositories = new AuthRepositories();
export const nodemailerService = new NodemailerService();
export const jwtService = new JwtService();

export const blogsService = new BlogsService(blogsRepositories);
export const postsService = new PostsService(
  postsRepository,
  blogsQueryRepositories,
  postsQueryRepository,
);
export const commentsService = new CommentsService(
  userQueryRepository,
  commentsRepositories,
);
export const userService = new UserService(userRepository, argon2Service);

export const authService = new AuthService(
  authRepositories,
  jwtService,
  userRepository,
  argon2Service,
  nodemailerService,
);

export const securityService = new SecurityService(
  jwtService,
  authRepositories,
);
