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
import { Container } from "inversify";
import { CommentsQueryRepositories } from "./comments/repositories/comments.queryRepository";

export const container: Container = new Container();

// Repositories
container.bind<BlogsRepositories>(BlogsRepositories).to(BlogsRepositories);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
container
  .bind<BlogsQueryRepositories>(BlogsQueryRepositories)
  .to(BlogsQueryRepositories);
container
  .bind<PostsQueryRepository>(PostsQueryRepository)
  .to(PostsQueryRepository);
container
  .bind<UserQueryRepository>(UserQueryRepository)
  .to(UserQueryRepository);
container
  .bind<CommentsRepositories>(CommentsRepositories)
  .to(CommentsRepositories);
container.bind<UserRepository>(UserRepository).to(UserRepository);
container.bind<AuthRepositories>(AuthRepositories).to(AuthRepositories);
container
  .bind<CommentsQueryRepositories>(CommentsQueryRepositories)
  .to(CommentsQueryRepositories);

// Services adapters
container.bind<Argon2Service>(Argon2Service).to(Argon2Service);
container.bind<NodemailerService>(NodemailerService).to(NodemailerService);
container.bind<JwtService>(JwtService).to(JwtService);

// Services
container.bind<BlogsService>(BlogsService).to(BlogsService);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<CommentsService>(CommentsService).to(CommentsService);
container.bind<UserService>(UserService).to(UserService);
container.bind<AuthService>(AuthService).to(AuthService);
container.bind<SecurityService>(SecurityService).to(SecurityService);
