import { Router, Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import {Post} from '../../../posts/types/post'



export function updatePostHandler(req: Request, res: Response): void {
    const id = req.params.id;

    const index = db.posts.findIndex(post => post.id === id);
    if (index === -1) {
        res.status(HttpStatus.NotFound).send({ error: "Post not found" });
        return;
    }


    const blogId = req.body.blogId;
    const blog = db.blogs.find(b => b.id === blogId);
    if (!blog) {
        res.status(HttpStatus.NotFound).send({ error: "Blog not found" });
        return;
    }

    const updatedPost: Post = {
        ...db.posts[index],
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: blog.id,
        blogName: blog.name,
    };

    db.posts[index] = updatedPost;

    res.sendStatus(HttpStatus.NoContent);
}