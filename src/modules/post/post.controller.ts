import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post as PostMethod,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CustomError } from "../../err/custom/Error.filter";
import { JwtAuthGuard } from "../auth/auth.guard";
import { Post } from "./post.dto";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch()
  async download(): Promise<Post[]> {
    try {
      const posts = await this.postService.download();
      if (posts.length === 0) {
        throw new NotFoundException("No posts were downloaded.");
      }
      return posts;
    } catch (error) {
      throw new CustomError(error.message);
    }
  }

  @PostMethod()
  async create(@Body() data: Post): Promise<Post> {
    if (!data.title || !data.body) {
      throw new BadRequestException("Title and body are required.");
    }
    try {
      return await this.postService.create(data);
    } catch (error) {
      throw new CustomError(error.message);
    }
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() data: Post): Promise<Post> {
    if (!id) {
      throw new BadRequestException("Post ID is required.");
    }
    try {
      return await this.postService.update({ id, ...data });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string): Promise<Post> {
    if (!id) {
      throw new BadRequestException("Post ID is required.");
    }
    try {
      return await this.postService.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get()
  async list(): Promise<Post[]> {
    try {
      const posts = await this.postService.list();
      if (posts.length === 0) {
        throw new NotFoundException("No posts found.");
      }
      return posts;
    } catch (error) {
      throw new CustomError(error.message);
    }
  }
}
