import {body} from "express-validator";
import { db } from '../../db/in-memory.db';
const titleValidation= body("title")
    .isString()
    .withMessage("Title should be string")
    .trim()
    .isLength({min: 1 , max: 30})
    .withMessage('Length of title is not correct')

const shortDescriptionValidation= body("shortDescription")
    .isString()
    .withMessage("ShortDescription should be string")
    .trim()
    .isLength({min: 1 , max: 100})
    .withMessage('ShortDescription of name is not correct')

const contentValidation= body("content")
    .isString()
    .withMessage("Content should be string")
    .trim()
    .isLength({min: 1 , max: 1000})
    .withMessage('Content of name is not correct')

const blogId= body("blogId")
    .isString()
    .withMessage("BlogId should be string")
    .custom(async (value : string) => {
        const blog = await db.blogs.findIndex(b => b.id === value);
        if (blog === -1) {
            throw new Error('ID Blog id does not exist in the database');
        }
        return true;
    })

export const postsInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogId
]