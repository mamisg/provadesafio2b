import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BadRequest } from "../../err/BadRequest.filter";
import { NotFound } from "../../err/NotFound.filter";
import { LoginDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn", () => {
    it("should sign in a user", async () => {
      const data: LoginDto = {
        email: "john.doe@example.com",
        password: "Password@123",
      };

      const result = { email: "john.doe@example.com", token: "jwt-token" };
      jest.spyOn(authService, "signIn").mockResolvedValue(result);

      const response = await controller.signIn(data);
      expect(response).toEqual(result);
    });

    it("should throw BadRequest on error", async () => {
      const data: LoginDto = {
        email: "john.doe@example.com",
        password: "Password@123",
      };

      jest.spyOn(authService, "signIn").mockRejectedValue(new Error("Invalid credentials"));

      await expect(controller.signIn(data)).rejects.toThrowError(BadRequest);
    });
  });

  describe("signUp", () => {
    it("should sign up a user", async () => {
      const data: RegisterUserDto = {
        email: "john.doe@example.com",
        password: "Password@123",
        name: "John Doe",
      };

      const result = { id: "user-id", token: "oi", ...data };
      jest.spyOn(authService, "signUp").mockResolvedValue(result);

      const response = await controller.signUp(data);
      expect(response).toEqual(result);
    });

    it("should throw BadRequest on error", async () => {
      const data: RegisterUserDto = {
        email: "john.doe@example.com",
        password: "Password@123",
        name: "John Doe",
      };

      jest.spyOn(authService, "signUp").mockRejectedValue(new Error("Email already registered"));

      await expect(controller.signUp(data)).rejects.toThrowError(BadRequest);
    });
  });

  describe("logout", () => {
    it("should logout a user", async () => {
      const token = "jwt-token";
      const user = { id: "user-id", email: "john.doe@example.com" };

      jest.spyOn(authService, "logout").mockResolvedValue(true);

      const response = await controller.logout(token);
      expect(response).toEqual(true);
    });

    it("should throw NotFound if token is not found", async () => {
      const token = "invalid-token";

      jest.spyOn(authService, "logout").mockResolvedValue(null);

      await expect(controller.logout(token)).rejects.toThrowError(BadRequest);
    });

    it("should throw BadRequest on error", async () => {
      const token = "jwt-token";

      jest.spyOn(authService, "logout").mockRejectedValue(new Error("Logout failed"));

      await expect(controller.logout(token)).rejects.toThrowError(BadRequest);
    });
  });
});
