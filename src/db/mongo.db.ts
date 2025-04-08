import {Collection, Db, MongoClient} from 'mongodb';
import {Blog} from '../blogs/types/blog'
import {Post} from '../posts/types/post'
import {SETTINGS} from "../core/settings/settings"

const BLOG_COLLECTION_NAME: string = 'blog'
const POST_COLLECTION_NAME: string = 'post'

export let client: MongoClient
export let blogCollection: Collection<Blog>
export let postCollection: Collection<Post>

export async function runDb(url:string): Promise<void> {
    client = new MongoClient(url);
    const db: Db = client.db(SETTINGS.DB_NAME)

    blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME)
    postCollection = db.collection<Post>(POST_COLLECTION_NAME)

    try{
        await client.connect();
        await db.command({ping: 1})
        console.log("Database Connected")
    }
    catch(err){
        await client.close();
        console.log("Database not connected")
    }

}