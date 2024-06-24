import { Test, TestingModule } from "@nestjs/testing";
import { CustomError } from "../../err/custom/Error.filter";
import { prisma } from "../../prisma/prisma-connection";
import { UserDto } from "./user.dto";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userData = {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
        token: "token",
        createdIn: new Date(),
        updated: new Date(),
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);
      jest.spyOn(prisma.user, "create").mockResolvedValue(userData);

      const result = await service.create(userData);
      expect(result).toEqual(userData);
    });

    it("should throw CustomError if email already exists", async () => {
      const userId = "1"
      const userData = {
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
        token: "token",
        createdIn: new Date(),
        updated: new Date(),
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(userData);
    
      jest.spyOn(prisma.user, "update").mockRejectedValue(new Error("E-mail already registered"));
    
      await expect(service.update(userId, userData)).rejects.toThrowError(
        new CustomError("E-mail already registered")
      );
    });
  });

  describe("update", () => {
    it("should update an existing user", async () => {
      const userId = "1";
      const userData = {
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
        token: "token",
        createdIn: new Date(),
        updated: new Date(),
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(userData);
      jest.spyOn(prisma.user, "update").mockResolvedValue(userData);

      const result = await service.update(userId, userData);
      expect(result).toEqual(userData);
    });

    it("should throw CustomError if user ID is not provided", async () => {
      await expect(service.update("", {
        name: '',
        password: '',
        email: '',
        token: ''
      })).rejects.toThrow(CustomError);
    });

    it("should throw CustomError if user is not found", async () => {
      const userId = "999";
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      await expect(service.update(userId, {
        name: '',
        password: '',
        email: '',
        token: ''
      })).rejects.toThrow(CustomError);
    });

    it("should throw CustomError if email already exists", async () => {
      const userId = "1"
      const userData = {
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
        token: "token",
        createdIn: new Date(),
        updated: new Date(),
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(userData);
    
      jest.spyOn(prisma.user, "update").mockRejectedValue(new Error("E-mail already registered"));
    
      await expect(service.update(userId, userData)).rejects.toThrowError(
        new CustomError("E-mail already registered")
      );
    });
  });

  describe("list", () => {
    it("should return a list of users", async () => {
      const userList = [
        { 
          id: "1", 
          name: "John Doe", 
          email: "john.doe@example.com", 
          password: "password", 
          token: "token", 
          createdIn: new Date(), 
          updated: new Date() },
        { 
          id: "2", 
          name: "Jane Doe", 
          email: "jane.doe@example.com", 
          password: "password", 
          token: "token", 
          createdIn: new Date(), 
          updated: new Date() 
        }
      ];
  
      jest.spyOn(prisma.user, 
        "findMany").mockResolvedValue(userList);
  
      const result = await service.list();
      expect(result).toEqual(userList);
    });
  });

  describe("delete", () => {
    it("should delete a user", async () => {
      const userId = "1";
      const deletedUser = { 
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password",
        token: "token",
        createdIn: new Date(),
        updated: new Date(),
       };
  
      jest.spyOn(prisma.user, "delete").mockResolvedValue(deletedUser);
  
      const result = await service.delete(userId);
      expect(result).toEqual(deletedUser);
    });
  
    it("should throw CustomError if user ID is not provided", async () => {
      await expect(service.delete("")).rejects.toThrowError(new CustomError("User ID was not found"));
    });
  });
  describe("updateToken", () => {
    it("should update the token for a user", async () => {
      const user = { id: "1", name: "John Doe", email: "john.doe@example.com", password: "password", token: "oldToken", createdIn: new Date(), updated: new Date() };
      const updatedToken = "newToken";
      const updatedUser = { ...user, token: updatedToken };
  
      jest.spyOn(prisma.user, "update").mockResolvedValue(updatedUser);
  
      const result = await service.updateToken(user);
      expect(result).toEqual(updatedUser);
    });
  
    it("should throw CustomError if user ID is not provided", async () => {
      const user = { id: "", name: "John Doe", email: "john.doe@example.com", password: "password", token: "token", createdIn: new Date(), updated: new Date() };
  
      await expect(service.updateToken(user)).rejects.toThrowError(new CustomError("User ID is required for updating."));
    });
  });
  
  describe("countUser", () => {
    it("should return the count of users", async () => {
      const userCount = 10;
  
      jest.spyOn(prisma.user, "count").mockResolvedValue(userCount);
  
      const result = await service.countUser();
      expect(result).toEqual(userCount);
    });
  });
  
  describe("findToken", () => {
    it("should return user with the given token", async () => {
      const token = "token";
      const user = { id: "1", name: "John Doe", email: "john.doe@example.com", password: "password", token, createdIn: new Date(), updated: new Date() };
  
      jest.spyOn(prisma.user, "findFirst").mockResolvedValue(user);
  
      const result = await service.findToken(token);
      expect(result).toEqual(user);
    });
  
    it("should return undefined if token is empty", async () => {
      const token = "";
      const result = await service.findToken(token);
      expect(result).toBeUndefined();
    });
  
    it("should return undefined if token is not found", async () => {
      const token = "nonexistentToken";
  
      jest.spyOn(prisma.user, "findFirst").mockResolvedValue(null);
  
      const result = await service.findToken(token);
      expect(result).toBeUndefined();
    });
  });
});
