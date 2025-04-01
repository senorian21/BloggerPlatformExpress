import{ Request, Response } from "express";
import {db} from "../../../db/in-memory.db"
import {HttpStatus} from "../../../core/types/http-statuses"
import {BlogInput} from "../../../blogs/dto/blog.input-dto"
import {Blog} from "../../types/blog";

export function postBlogHandler(req: Request, res: Response) {
    const newId = db.blogs.length ? (parseInt(db.blogs[db.blogs.length - 1].id) + 1).toString() : "1";

    const newBlog: Blog = {
        id: (newId).toString(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    db.blogs.push(newBlog);
    res.status(HttpStatus.Created).send(newBlog);
}