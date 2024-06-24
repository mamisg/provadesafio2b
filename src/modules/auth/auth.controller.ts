import { Body, Controller, Param, Post } from "@nestjs/common";
import { BadRequest } from "../../err/BadRequest.filter";
import { NotFound } from "../../err/NotFound.filter";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signin")
  async signIn(@Body() data: LoginDto) {
    try {
      return await this.authService.signIn(data);
    } catch (error) {
      throw new BadRequest(error.message);
    }
  }

  @Post("/signup")
  async signUp(@Body() data: RegisterUserDto) {
    try {
      return await this.authService.signUp(data);
    } catch (error) {
      throw new BadRequest(error.message);
    }
  }

  @Post("/logout/:token")
  async logout(@Param("token") token: string) {
    try {
      const user = await this.authService.logout(token);
      if (!user) throw new NotFound(`Token ${token} not found.`);
      return user;
    } catch (error) {
      throw new BadRequest(error.message);
    }
  }
}
