import {Request, Response} from "express";
import {commentsQueryInput} from "../../../comments/types/comments-query.input";
import {PostQueryInput} from "../../types/post-query.input";
import {
    paginationAndSortingDefault
} from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {postsQueryRepository} from "../../repositories/posts.queryRepository";
import {HttpStatus} from "../../../core/types/http-statuses";
import {commentsQueryRepositories} from "../../../comments/repositories/comments.queryRepository";


export async function getPostCommentsListHandler(
    req: Request<{ postId: string }, {}, {}, commentsQueryInput>,
    res: Response,
) {
    const postId = req.params.postId;
    const post = await postsQueryRepository.findPostById(postId);

    if (!post) {
        res.sendStatus(HttpStatus.NotFound); // Завершаем выполнение функции
        return
    }

    const queryInput: commentsQueryInput = {
        ...paginationAndSortingDefault,
        ...req.query,
    };

    const allCommentsByPost =
        await commentsQueryRepositories.findAllCommentsByPost(queryInput, postId);

     res.status(HttpStatus.Ok).send(allCommentsByPost);
}