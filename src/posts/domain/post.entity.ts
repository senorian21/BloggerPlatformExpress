import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { PostInput } from "../dto/post.input-dto";
import { likeStatus } from "../../like/domain/like.entity";

export type newestLikes = {
  addedAt: Date;
  userId: string;
  login: string;
};

export class PostEntity {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: Date,
    public deletedAt: Date | null,
    public likeCount: number,
    public dislikeCount: number,
    public newestLikes: newestLikes[],
  ) {}
  static createPost(dto: PostInput, blogName: string) {
    const newPost = new PostModel();
    newPost.title = dto.title;
    newPost.content = dto.content;
    newPost.shortDescription = dto.shortDescription;
    newPost.blogId = dto.blogId;
    newPost.blogName = blogName;
    newPost.createdAt = new Date();
    return newPost;
  }
  updatePost(dto: PostEntity, blogName: string) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
    this.blogName = blogName;
  }

  deletePost() {
    this.deletedAt = new Date();
  }

  public setLikeStatus(
    userId: string,
    login: string,
    newStatus: likeStatus,
    previousStatus: likeStatus,
  ): void {
    const existingLikeIndex = this.newestLikes.findIndex(
      (entry) => entry.userId === userId,
    );

    if (existingLikeIndex > -1) {
      this._removeLike(existingLikeIndex);
    }

    if (previousStatus === likeStatus.Dislike) {
      this.dislikeCount -= 1;
    }

    if (newStatus === likeStatus.Like) {
      this._addLike(userId, login);
    } else if (newStatus === likeStatus.Dislike) {
      this.dislikeCount += 1;
    }
  }

  private _addLike(userId: string, login: string): void {
    this.likeCount += 1;

    this.newestLikes.unshift({
      addedAt: new Date(),
      userId,
      login,
    });

    if (this.newestLikes.length > 3) {
      this.newestLikes.pop();
    }
  }

  private _removeLike(index: number): void {
    const removed = this.newestLikes.splice(index, 1)[0];
    if (removed) {
      this.likeCount -= 1;
    }
  }
}

interface PostMethods {
  updatePost(dto: PostInput, blogName: string): void;
  deletePost(): void;
  setLikeStatus(
    userId: string,
    login: string,
    newStatus: likeStatus,
    previousStatus: likeStatus,
  ): void;
  updateLikeStatus(userId: string, login: string, newStatus: likeStatus): void;
  clearUserLike(userId: string): void;
}

type PostStatic = typeof PostEntity;

type PostModelType = Model<PostEntity, {}, PostMethods> & PostStatic;

export type postDocument = HydratedDocument<PostEntity, PostMethods>;

const newestLikesShema = new mongoose.Schema<newestLikes>({
  addedAt: { type: Date, required: true },
  userId: { type: String, required: true },
  login: { type: String, required: true },
});

const postSchema = new mongoose.Schema<PostEntity>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  deletedAt: { type: Date, default: null },
  likeCount: { type: Number, default: 0, required: true },
  dislikeCount: { type: Number, default: 0, required: true },
  newestLikes: {
    type: [newestLikesShema],
    required: true,
  },
});

postSchema.loadClass(PostEntity);

export const PostModel = model<PostEntity, PostModelType>("Post", postSchema);
