import { param } from 'express-validator';
import { db } from '../../../db/in-memory.db';

export const idValidation = param('id')
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isLength({ min: 1 })
    .withMessage('ID must not be empty')
    .isNumeric()
    .withMessage('ID must be a numeric string')
    .custom(async (value : string) => {
        const blog = await db.blogs.findIndex(b => b.id === value);
        if (blog === -1) {
            throw new Error('ID does not exist in the database');
        }
        return true;
    })

