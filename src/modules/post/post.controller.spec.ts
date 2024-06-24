import { Test } from "@nestjs/testing";
import { CustomError } from "../../err/custom/Error.filter";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

describe("PostController", () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    }).compile();

    controller = moduleRef.get<PostController>(PostController);
    service = moduleRef.get<PostService>(PostService);
  });

  describe("PostController", () => {
    let controller: PostController;
    let service: PostService;
  
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [PostController],
        providers: [PostService],
      }).compile();
  
      controller = moduleRef.get<PostController>(PostController);
      service = moduleRef.get<PostService>(PostService);
    });
  
    describe("download", () => {
      it("should return a list of downloaded posts", async () => {
        const postsList = [
          {
            id: "1",
            title: "Post 1",
            body: "Body 1",
            userId: 1,
            createdIn: new Date(),
            updated: new Date(),
          },
          {
            id: "2",
            title: "Post 2",
            body: "Body 2",
            userId: 1,
            createdIn: new Date(),
            updated: new Date(),
          },
        ];
  
        jest.spyOn(service, "download").mockResolvedValue(postsList);
  
        const result = await controller.download();
        expect(result).toEqual(postsList);
      });
  
      it("should throw CustomError when no posts are downloaded", async () => {
        jest.spyOn(service, "download").mockResolvedValue([]);
  
        await expect(controller.download()).rejects.toThrow(CustomError);
      });
    });
  });

  describe("create", () => {
    it("should create a new post", async () => {
      const postData = { title: "Test Title", body: "Test Body", userId: 1 };
      const createdPost = { ...postData, id: "1", createdIn: new Date(), updated: new Date() };

      jest.spyOn(service, "create").mockResolvedValue(createdPost);

      const result = await controller.create(postData);
      expect(result).toEqual(createdPost);
    });
  });

  describe("update", () => {
    it("should update a post", async () => {
      const postId = "1";
      const updatedData = { title: "Updated Title", body: "Updated Body", userId: 1 };
      const updatedPost = {
        ...updatedData,
        id: postId,
        createdIn: new Date(),
        updated: new Date(),
      };

      jest.spyOn(service, "update").mockResolvedValue(updatedPost);

      const result = await controller.update(postId, updatedData);
      expect(result).toEqual(updatedPost);
    });
  });

  describe("delete", () => {
    it("should delete a post", async () => {
      const postId = "1";
      const deletedPost = {
        id: postId,
        title: "Test Title",
        body: "Test Body",
        userId: 1,
        createdIn: new Date(),
        updated: new Date(),
      };

      jest.spyOn(service, "delete").mockResolvedValue(deletedPost);

      const result = await controller.delete(postId);
      expect(result).toEqual(deletedPost);
    });
  });

  describe("list", () => {
    it("should return a list of posts", async () => {
      const postsList = [
        {
          id: "1",
          title: "Post 1",
          body: "Body 1",
          userId: 1,
          createdIn: new Date(),
          updated: new Date(),
        },
        {
          id: "2",
          title: "Post 2",
          body: "Body 2",
          userId: 1,
          createdIn: new Date(),
          updated: new Date(),
        },
      ];

      jest.spyOn(service, "list").mockResolvedValue(postsList);

      const result = await controller.list();
      expect(result).toEqual(postsList);
    });

    it("should throw CustomError when no posts are found", async () => {
      jest.spyOn(service, "list").mockResolvedValue([]);

      await expect(controller.list()).rejects.toThrow(CustomError);
    });
  });
});
