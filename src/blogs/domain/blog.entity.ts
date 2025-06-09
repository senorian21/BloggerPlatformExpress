import mongoose from "mongoose";

export type Blog = {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
};

const blogSchema = new mongoose.Schema<Blog>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
});

export const BlogModel = mongoose.model("blog", blogSchema)