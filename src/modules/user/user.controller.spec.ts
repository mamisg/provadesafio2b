import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { NotFound } from '../../err/NotFound.filter';

describe("UserController", () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userData = { name: "John Doe", email: "john.doe@example.com", token: "teste", password: "Password1!!" };
      const createdUser = { ...userData, id: "1", createdIn: new Date(), updated: new Date() }

      jest.spyOn(userService, "create").mockResolvedValue(createdUser);

      const result = await controller.create(userData);
      expect(result).toEqual(createdUser);
    });

    it("should throw BadRequestException if create method in UserService throws an error", async () => {
      jest.spyOn(userService, "create").mockRejectedValue(new Error("Invalid data"));

      await expect(controller.create({
        name: '',
        password: '',
        email: '',
        token: ''
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe("update", () => {
    it("should update an existing user", async () => {
      const userId = "1";
      const updatedData = { name: "Jane Doe", email: "jane.doe@example.com", token: "teste", password: "Password1!!" };
      const updatedUser = {
        ...updatedData,
        id: userId,
        createdIn: new Date(),
        updated: new Date(),
      };

      jest.spyOn(userService, "update").mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updatedData);
      expect(result).toEqual(updatedUser);
    });

    it("should throw NotFoundException if user is not found", async () => {
      const userId = "999";
      jest.spyOn(userService, "update").mockResolvedValue(null);

      await expect(controller.update(userId, {
        name: '',
        password: '',
        email: '',
        token: ''
      })).rejects.toThrow(NotFound);
    });

    it("should throw BadRequestException if update method in UserService throws an error", async () => {
      jest.spyOn(userService, "update").mockRejectedValue(new Error("Invalid data"));

      await expect(controller.update("1", {
        name: '',
        password: '',
        email: '',
        token: ''
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe("list", () => {
    it("should return a list of users", async () => {
      const usersList = [
        {
          id: "1",
          name: "Jane Doe",
          email: "jane.doe@example.com",
          token: "teste",
          password: "Password1!!",
          createdIn: new Date(),
          updated: new Date(),
        },
        {
          id: "2",
          name: "Jane Doe",
          email: "jane.doe@example.com",
          token: "teste",
          password: "Password1!!",
          createdIn: new Date(),
          updated: new Date(),
        }
      ];
      jest.spyOn(userService, "list").mockResolvedValue(usersList);

      const result = await controller.list();
      expect(result).toEqual(usersList);
    });

    it("should throw BadRequestException if list method in UserService throws an error", async () => {
      jest.spyOn(userService, "list").mockRejectedValue(new Error("Failed to fetch users"));

      await expect(controller.list()).rejects.toThrow(BadRequestException);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const userId = "1";
      const deletedUser = {
        id: userId,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        token: "teste",
        password: "Password1!!",
        createdIn: new Date(),
        updated: new Date(),
      };

      jest.spyOn(userService, "delete").mockResolvedValue(deletedUser);

      const result = await controller.delete(userId);
      expect(result).toEqual(deletedUser);
    });

    it("should throw NotFoundException if user is not found", async () => {
      const userId = "999";
      jest.spyOn(userService, "delete").mockResolvedValue(null);

      await expect(controller.delete(userId)).rejects.toThrow(NotFound);
    });

    it("should throw BadRequestException if delete method in UserService throws an error", async () => {
      jest.spyOn(userService, "delete").mockRejectedValue(new Error("Failed to delete user"));

      await expect(controller.delete("1")).rejects.toThrow(BadRequestException);
    });
  });

  describe("findToken", () => {
    it("should find a user by token", async () => {
      const token = "abc123";
      const user = {
        id: "1",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        token,
        password: "Password1!!",
        createdIn: new Date(),
        updated: new Date(),
        };
      jest.spyOn(userService, "findToken").mockResolvedValue(user);

      const result = await controller.findToken(token);
      expect(result).toEqual(user);
    });

    it("should throw NotFoundException if user is not found by token", async () => {
      const token = "invalidToken";
      jest.spyOn(userService, "findToken").mockResolvedValue(null);

      await expect(controller.findToken(token)).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if findToken method in UserService throws an error", async () => {
      jest.spyOn(userService, "findToken").mockRejectedValue(new Error("Failed to find user by token"));

      await expect(controller.findToken("invalidToken")).rejects.toThrow(BadRequestException);
    });
  });
});
