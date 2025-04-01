import { Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import {HttpStatus} from "../../../core/types/http-statuses";

export function getBlogsListHandler(req: Request, res: Response) {
    res.status(HttpStatus.Ok).send(db.blogs);
}