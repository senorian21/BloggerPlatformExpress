import { ObjectId } from "mongodb";
import { BlogsQueryInput } from "../types/blog-query.input";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { blogViewModel } from "../types/blog-view-model";
import { mapToBlogListPaginatedOutput } from "../mappers/map-to-blog-list-paginated-output.util";
import { injectable } from "inversify";
import {BlogModel} from "../domain/blog.entity";


@injectable()
export class BlogsQueryRepositories {
  async findAllBlogs(
    queryDto: BlogsQueryInput,
  ): Promise<{ items: blogViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.$or = [];
      filter.$or.push({ name: { $regex: searchNameTerm, $options: "i" } });
    }

    const items = await BlogModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(+pageSize)

    const totalCount = await BlogModel.countDocuments(filter);
    return mapToBlogListPaginatedOutput(items, {
      pageNumber: +pageNumber,
      pageSize: +pageSize,
      totalCount,
    });
  }

  async findById(id: string): Promise<blogViewModel | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const blog = await BlogModel.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return mapToBlogViewModel(blog);
  }
}
