import { Injectable } from "@nestjs/common";
import axios from "axios";
import { CustomError } from "../../err/custom/Error.filter";
import { prisma } from "../../prisma/prisma-connection";
import { Post } from "./post.dto";

@Injectable()
export class PostService {
  async download(): Promise<Post[]> {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");

    const posts = await Promise.all(
      data.map(async (post: Post) => {
        return prisma.post.upsert({
          where: { id: post.id.toString() },
          update: {
            title: post.title,
            body: post.body,
            userId: post.userId,
          },
          create: {
            id: post.id.toString(),
            title: post.title,
            body: post.body,
            userId: post.userId,
          },
        });
      }),
    );

    return posts;
  }

  async create(postData: Post) {
    return prisma.post.create({
      data: {
        title: postData.title,
        body: postData.body,
        userId: postData.userId,
      },
    });
  }

  async update(postData: Post) {
    const { id, ...data } = postData;
    if (!id) throw new CustomError("Post ID is required for updating.");

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) throw new CustomError(`Post ID ${id} not found`);

    return prisma.post.update({
      where: { id },
      data: {
        id,
        ...data,
      },
    });
  }

  async delete(id: string) {
    if (!id) throw new CustomError("Post ID was not found");

    return prisma.post.delete({
      where: { id },
    });
  }

  async list() {
    return prisma.post.findMany();
  }
}
