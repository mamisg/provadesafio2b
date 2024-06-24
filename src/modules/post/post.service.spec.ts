import { Test, TestingModule } from "@nestjs/testing";
import { Post } from "@prisma/client";
import axios from "axios";
import { CustomError } from "../../err/custom/Error.filter";
import { prisma } from "../../prisma/prisma-connection";
import { PostService } from "./post.service";

jest.mock("axios");
jest.mock("../../prisma/prisma-connection", () => ({
  prisma: {
    post: {
      upsert: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe("PostService", () => {
  let service: PostService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("download", () => {
    it("should download posts and upsert them in the database", async () => {
      const postData: Post[] = [
        {
          id: "1",
          title: "Test Title",
          body: "Test Body",
          userId: 1,
          createdIn: new Date(),
          updated: new Date(),
        },
      ];
      const axiosResponse = { data: postData };
      const prismaResponse = [{ ...postData[0], createdIn: new Date(), updated: new Date() }];

      (axios.get as jest.Mock).mockResolvedValue(axiosResponse);
      (prisma.post.upsert as jest.Mock).mockResolvedValue(prismaResponse);
      
      const result = (await service.download()).flat();
      expect(result).toEqual(prismaResponse);
    });
  });

  describe("create", () => {
    it("should create a new post", async () => {
      const postData = { title: "Test Title", body: "Test Body", userId: 1, createdIn: new Date(), updated: new Date() };
      const prismaResponse = { ...postData, id: "1" };
  
      (prisma.post.create as jest.Mock).mockImplementation(async () => {
        return prismaResponse;
      });
  
      const result = await service.create(postData);
  
      expect(result).toEqual(prismaResponse);
    });
  });
  

  describe("update", () => {
    it("should update a post in the database", async () => {
      const postData: Post = {
        id: "1",
        title: "Updated Title",
        body: "Updated Body",
        userId: 2,
        createdIn: new Date(),
        updated: new Date(),
      };
      const prismaResponse = { ...postData, createdIn: new Date(), updated: new Date() };

      (prisma.post.findUnique as jest.Mock).mockResolvedValue(prismaResponse);
      (prisma.post.update as jest.Mock).mockResolvedValue(prismaResponse);

      const result = await service.update(postData);
      expect(result).toEqual(prismaResponse);
    });

    it("should throw an error if post ID is not provided", async () => {
      const postData: Post = {
        id: "",
        title: "Updated Title",
        body: "Updated Body",
        userId: 2,
        createdIn: new Date(),
        updated: new Date(),
      };

      await expect(service.update(postData)).rejects.toThrowError(
        new CustomError("Post ID is required for updating."),
      );
    });

    it("should throw an error if post ID is not found", async () => {
      const postData: Post = {
        id: "1",
        title: "Updated Title",
        body: "Updated Body",
        userId: 2,
        createdIn: new Date(),
        updated: new Date(),
      };

      (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(postData)).rejects.toThrowError(
        new CustomError(`Post ID ${postData.id} not found`),
      );
    });
  });

  describe("delete", () => {
    it("should delete a post from the database", async () => {
      const postId = "1";
      const prismaResponse = {
        id: postId,
        title: "Test Title",
        body: "Test Body",
        userId: 1,
        createdIn: new Date(),
        updated: new Date(),
      };

      (prisma.post.delete as jest.Mock).mockResolvedValue(prismaResponse);

      const result = await service.delete(postId);
      expect(result).toEqual(prismaResponse);
    });

    it("should throw an error if post ID is not provided", async () => {
      await expect(service.delete("")).rejects.toThrowError(
        new CustomError("Post ID was not found"),
      );
    });
  });

  describe("list", () => {
    it("should return a list of posts from the database", async () => {
      const postData: Post[] = [
        {
          id: "1",
          title: "Test Title 1",
          body: "Test Body 1",
          userId: 1,
          createdIn: new Date(),
          updated: new Date(),
        },
        {
          id: "2",
          title: "Test Title 2",
          body: "Test Body 2",
          userId: 2,
          createdIn: new Date(),
          updated: new Date(),
        },
      ];

      (prisma.post.findMany as jest.Mock).mockResolvedValue(postData);

      const result = await service.list();
      expect(result).toEqual(postData);
    });
  });
});
