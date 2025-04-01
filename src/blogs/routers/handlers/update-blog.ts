import{ Request, Response } from "express";
import {db} from "../../../db/in-memory.db"
import {HttpStatus} from "../../../core/types/http-statuses"



export function putBlogHandler(req: Request, res: Response) {
    const id = req.params.id
    const indexBlog = db.blogs.findIndex(b => b.id === id)

    if(indexBlog === -1) {

    }

    const updateBlog = {
        ...db.blogs[indexBlog],
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }

    db.blogs[indexBlog] = updateBlog
    res.sendStatus(HttpStatus.NoContent)
}