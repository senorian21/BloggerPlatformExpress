import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';
import {getBlogsListHandler} from "./handlers/get-blogs-list";
import {getBlogHandler} from "./handlers/get-blog";
import {deleteBlogHandler} from "./handlers/delete-blog";
import {postBlogHandler} from "./handlers/create-blog";
import {putBlogHandler} from "./handlers/update-blog";

export const blogsRouter = Router({});

blogsRouter.get('', getBlogsListHandler)

blogsRouter.get('/:id', getBlogHandler)

blogsRouter.delete('/:id', deleteBlogHandler)

blogsRouter.post('', postBlogHandler)

blogsRouter.put('/:id', putBlogHandler)