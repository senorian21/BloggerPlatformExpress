import { Router, Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';

export function deletePostHandler(req: Request, res: Response) {
    const id = req.params.id
    db.posts = db.posts.filter(p => p.id === id)
    res.sendStatus(HttpStatus.NoContent);
}