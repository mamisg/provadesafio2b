import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { CustomError } from "../../err/custom/Error.filter";
import { LoginDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findEmail: jest.fn(),
            create: jest.fn(),
            updateToken: jest.fn(),
            findToken: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn", () => {
    it("should sign in a user", async () => {
      const loginDto: LoginDto = {
        email: "john.doe@example.com",
        password: "Password@123"
      };
      const user = {
        id: "1",
        name: "John",
        email: "john.doe@example.com",
        password: await bcrypt.hash("Password@123", 10),
        token: "teste",
        createdIn: new Date(),
        updated: new Date(),
      };

      jest.spyOn(userService, "findEmail").mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
      jest.spyOn(jwtService, "sign").mockReturnValue("jwt-token");
      jest.spyOn(userService, "updateToken").mockResolvedValue(user);

      const result = await service.signIn(loginDto);
      expect(result).toEqual({ email: loginDto.email, token: "jwt-token" });
    });

    it("should throw CustomError if email not found", async () => {
      const loginDto: LoginDto = { email: "notfound@example.com", password: "Password@123" };

      jest.spyOn(userService, "findEmail").mockResolvedValue(null);

      await expect(service.signIn(loginDto)).rejects.toThrowError(new CustomError("Email not found"));
    });

    it("should throw CustomError if password is invalid", async () => {
      const loginDto: LoginDto = {
        email: "john.doe@example.com",
        password: await bcrypt.hash("Password@123", 10)
      };
      const user = {
        id: "1",
        name: "John",
        email: "john.doe@example.com",
        password: await bcrypt.hash("Password@123", 10),
        token: "teste",
        createdIn: new Date(),
        updated: new Date(),
      };

      jest.spyOn(userService, "findEmail").mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      await expect(service.signIn(loginDto)).rejects.toThrowError(new CustomError("Invalid Password"));
    });
  });

  describe("signUp", () => {
    it("should sign up a user", async () => {
      const createDto: RegisterUserDto = {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "Password@123"
      };

      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed-password" as never);
      jest.spyOn(jwtService, "sign").mockReturnValue("jwt-token");
      jest.spyOn(userService, "create").mockResolvedValue({
        id: "1",
        name: createDto.name,
        email: createDto.email,
        password: "hashed-password",
        token: "jwt-token",
        createdIn: new Date(),
        updated: new Date(),
      });

      const result = await service.signUp(createDto);
      expect(result).toEqual({ email: createDto.email, token: "jwt-token" });
    });

    it("should throw CustomError if email already exists", async () => {
      const createDto: RegisterUserDto = { name: "John Doe", email: "john.doe@example.com", password: "Password@123" };

      jest.spyOn(userService, "create").mockRejectedValue(new Error("E-mail already registered"));

      await expect(service.signUp(createDto)).rejects.toThrowError(new CustomError("E-mail already registered"));
    });
  });

  describe("logout", () => {
    it("should logout a user", async () => {
      const token = "jwt-token";
      const user = {
        id: "1",
        name: "John",
        email: "john.doe@example.com",
        password: await bcrypt.hash("Password@123", 10),
        token,
        createdIn: new Date(),
        updated: new Date(),
      };

      jest.spyOn(userService, "findToken").mockResolvedValue(user);
      jest.spyOn(userService, "update").mockResolvedValue({
        ...user,
        token: "",
      });

      const result = await service.logout(token);
      expect(result).toBe(true);
    });

    it("should return false if token is not found", async () => {
      const token = "invalid-token";

      jest.spyOn(userService, "findToken").mockResolvedValue(null);

      const result = await service.logout(token);
      expect(result).toBe(false);
    });
  });
});
