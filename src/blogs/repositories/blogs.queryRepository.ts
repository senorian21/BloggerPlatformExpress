import { Blog } from "../types/blog";
import { blogCollection } from "../../db/mongo.db";
import { ObjectId, WithId } from "mongodb";
import { BlogsQueryInput } from "../types/blog-query.input";

export const blogsQueryRepositories = {
  async findAllBlogs(
    queryDto: BlogsQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.$or = [];
      filter.$or.push({ name: { $regex: searchNameTerm, $options: "i" } });
    }

    const items = await blogCollection
      .find(filter)

      .sort({ [sortBy]: sortDirection })

      .skip(skip)

      .limit(+pageSize)
      .toArray();
    const totalCount = await blogCollection.countDocuments(filter);
    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Blog> | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },
};
