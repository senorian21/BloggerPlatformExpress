import request from 'supertest';
import express from 'express';

import { setupApp } from '../../../src/setup-app';
import {BlogInput} from '../../../src/blogs/dto/blog.input-dto'
import { HttpStatus } from '../../../src/core/types/http-statuses';

import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token'
import { clearDb } from '../utils/clear-db';

describe('Blogs API validation', () => {
    const app = express();
    setupApp(app);

    const adminToken = generateBasicAuthToken();

    const correctTestBlogData: BlogInput = {
        name : 'string',
        description: 'string',
        websiteUrl: 'https://example.com/folder/subfolder/'
    }

    beforeAll(async () => {
        await clearDb(app);
    });

    it(`should not create blog when incorrect body passed; POST /blogs'`, async () => {
        const invalidDataSet1 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name : ' ',
                description: ' ',
                websiteUrl: ' '
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

        const invalidDataSet2 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name : '123',
                description: '123',
                websiteUrl: ' '
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

        const invalidDataSet3 = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name : '123',
                description: '',
                websiteUrl: ' '
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorsMessages).toHaveLength(2);

        // check что никто не создался
        const driverListResponse = await request(app)
            .get(BLOGS_PATH)
        expect(driverListResponse.body).toHaveLength(0);
    });

    it(`should not update blog when incorrect body passed; PUT /blogs'`, async () => {
        const createBlog = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,

            })
            .expect(HttpStatus.Created);


        const invalidDataSet2 = await request(app)
            .put(`${BLOGS_PATH}/${createBlog.body.id}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: ' '
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

        const invalidDataSet3 = await request(app)
            .put(`${BLOGS_PATH}/${createBlog.body.id}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: ' ',
                description: ' ',
                websiteUrl: ' '
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet3.body.errorsMessages).toHaveLength(3);

        const invalidDataSet4 = await request(app)
            .put(`${BLOGS_PATH}/${createBlog.body.id}`)
            .set('Authorization', adminToken)
            .send({
                ...correctTestBlogData,
                name: ' ',
                websiteUrl: ' '
            })
            .expect(HttpStatus.BadRequest);

        expect(invalidDataSet4.body.errorsMessages).toHaveLength(2);
    })
})