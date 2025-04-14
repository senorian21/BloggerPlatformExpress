import {Express} from "express";
import request from "supertest";
import {POSTS_PATH} from "../../../../src/core/paths/paths";
import {generateBasicAuthToken} from "../generate-admin-auth-token";
import {HttpStatus} from "../../../../src/core/types/http-statuses";
import {PostInput} from "../../../../src/posts/dto/post.input-dto";

export async function updatePost(
    app: Express,
    postId: string,
    postDto: PostInput,
) {
    const testPostData = { ...postDto };

    const updatedBlogRespons = await request(app)
        .put(`${POSTS_PATH}/${postId}`)
        .set("Authorization", generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.NoContent);
}
