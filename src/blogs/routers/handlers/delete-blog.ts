import{ Request, Response } from "express";
import {db} from "../../../db/in-memory.db"
import {HttpStatus} from "../../../core/types/http-statuses"



export function deleteBlogHandler(req: Request, res: Response) {
    const id = req.params.id
    db.blogs = db.blogs.filter(b => b.id !== id)
    res.sendStatus(HttpStatus.NoContent)
}