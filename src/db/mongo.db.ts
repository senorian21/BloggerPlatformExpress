import { Collection, Db, MongoClient } from "mongodb";
import { Blog } from "../blogs/types/blog";
import { Post } from "../posts/types/post";
import { User } from "../users/types/user";
import { comment } from "../comments/types/comment";
import { appConfig } from "../core/settings/settings";

const BLOG_COLLECTION_NAME: string = "blog";
const POST_COLLECTION_NAME: string = "post";
const USER_COLLECTION_NAME: string = "user";
const COMMENT_COLLECTION_NAME: string = "comment";

export let client: MongoClient;

export let blogCollection: Collection<Blog>;
export let postCollection: Collection<Post>;
export let userCollection: Collection<User>;
export let commentCollection: Collection<comment>;

// Флаг для определения режима работы (основной или тестовый)
let isTestMode = false;

export function setIsTestMode(mode: boolean): void {
  isTestMode = mode;
}

export async function runDb(url: string): Promise<void> {
  client = new MongoClient(url);

  // Выбор базы данных в зависимости от режима
  const dbName = isTestMode ? appConfig.DB_NAME_TEST : appConfig.DB_NAME;
  const db: Db = client.db(dbName);

  blogCollection = db.collection<Blog>(BLOG_COLLECTION_NAME);
  postCollection = db.collection<Post>(POST_COLLECTION_NAME);
  userCollection = db.collection<User>(USER_COLLECTION_NAME);
  commentCollection = db.collection<comment>(COMMENT_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log(`Connected to database: ${dbName}`);
  } catch (err) {
    await client.close();
    console.error("Failed to connect to the database:", err);
  }
}