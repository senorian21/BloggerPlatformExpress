import { ObjectId } from "mongodb";
import { PostQueryInput } from "../types/post-query.input";
import { mapToPostViewModel } from "../mappers/map-to-post-view-model.util";
import { mapToPostListPaginatedOutput } from "../mappers/map-to-post-list-paginated-output.util";
import { postViewModel } from "../types/post-view-model";
import { injectable } from "inversify";
import { PostModel } from "../domain/post.entity";

@injectable()
export class PostsQueryRepository {
  async findAllPosts(
    queryDto: PostQueryInput,
  ): Promise<{ items: postViewModel[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {
      deletedAt: null,
    };

    const items = await PostModel.find(filter)

      // "asc" (по возрастанию), то используется 1
      // "desc" — то -1 для сортировки по убыванию. - по алфавиту от Я-А, Z-A
      .sort({ [sortBy]: sortDirection })

      // пропускаем определённое количество док. перед тем, как вернуть нужный набор данных.
      .skip(skip)

      // ограничивает количество возвращаемых документов до значения pageSize
      .limit(+pageSize);
    const totalCount = await PostModel.countDocuments(filter);
    return mapToPostListPaginatedOutput(items, {
      pageNumber: +pageNumber,
      pageSize: +pageSize,
      totalCount,
    });
  }

  async findPostById(id: string) {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const post = await PostModel.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    if (!post || post.deletedAt !== null) {
      return null;
    }
    return mapToPostViewModel(post);
  }
  async findAllPostsByBlogId(queryDto: PostQueryInput, blogId: string) {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const filter = { blogId: blogId, deletedAt: null };
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      PostModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(+pageSize),

      PostModel.countDocuments(filter),
    ]);
    return mapToPostListPaginatedOutput(items, {
      pageNumber: +pageNumber,
      pageSize: +pageSize,
      totalCount,
    });
  }
}
