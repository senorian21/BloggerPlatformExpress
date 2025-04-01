import { Router, Request, Response } from 'express';
import { db } from '../../../db/in-memory.db';
import { HttpStatus } from '../../../core/types/http-statuses';

export function getPostHandler(req: Request, res: Response) {
    const id = req.params.id;
    const post = db.posts.find(p => p.id === id);

    res.status(HttpStatus.Ok).send(post);
}