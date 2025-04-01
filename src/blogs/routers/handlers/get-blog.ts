import{ Request, Response } from "express";
import {db} from "../../../db/in-memory.db"
import {HttpStatus} from "../../../core/types/http-statuses"



export function getBlogHandler(req: Request, res: Response) {
    const id = req.params.id
    const blog = db.blogs.find(b => b.id === id)
    res.status(HttpStatus.Ok).send(blog)
}