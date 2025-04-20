import { Post } from "../../posts/types/post";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";

import { PostQueryInput } from "../types/post-query.input";

export const postsRepository = {
  async findAllPosts(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const items = await postCollection
      .find(filter)

      // "asc" (по возрастанию), то используется 1
      // "desc" — то -1 для сортировки по убыванию. - по алфавиту от Я-А, Z-A
      .sort({ [sortBy]: sortDirection })

      // пропускаем определённое количество док. перед тем, как вернуть нужный набор данных.
      .skip(skip)

      // ограничивает количество возвращаемых документов до значения pageSize
      .limit(+pageSize)
      .toArray();
    const totalCount = await postCollection.countDocuments(filter);
    return { items, totalCount };
  },

  async findPostById(id: string) {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  },

  async createPost(newPost: Post) {
    const result = await postCollection.insertOne(newPost);
    return { ...newPost, _id: result.insertedId };
  },

  async updatePost(id: string, dto: Post) {
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
          blogName: dto.blogName,
          createdAt: dto.createdAt,
        },
      },
    );
  },

  async deletePost(id: string) {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Post not exist");
    }
  },

  async findAllPostsByBlogId(queryDto: PostQueryInput, blogId: string) {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const filter = { blogId: blogId };
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      postCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(+pageSize)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);
    return { items, totalCount };
  },
};
