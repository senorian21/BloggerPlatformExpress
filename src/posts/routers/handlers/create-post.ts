import { Router, Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';
import {Post} from '../../../posts/types/post'

export function createPostHandler(req: Request, res: Response) {
    const blogId = req.body.blogId;

    const blog = db.blogs.find(b => b.id === blogId);
    if (!blog) {
        res.status(HttpStatus.NotFound).send({ error: "Blog not found" });
        return
    }

    const newId = db.posts.length
        ? (parseInt(db.posts[db.posts.length - 1].id) + 1).toString()
        : "1";


    const newPost: Post = {
        id: newId,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: blog.id,
        blogName: blog.name,
    };

    db.posts.push(newPost);

    res.sendStatus(HttpStatus.Created);
}