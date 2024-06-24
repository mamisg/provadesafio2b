import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { NotFound } from "../../err/NotFound.filter";
import { UserDto } from "./user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: UserDto) {
    try {
      return await this.userService.create(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: UserDto) {
    try {
      const user = await this.userService.update(id, data);
      if (!user) throw new NotFound(id);
      return user;
    } catch (error) {
      if (error instanceof NotFound) throw error;
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async list(): Promise<UserDto[]> {
    try {
      return await this.userService.list();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    try {
      const user = await this.userService.delete(id);
      if (!user) throw new NotFound(id);
      return user;
    } catch (error) {
      if (error instanceof NotFound) throw error;
      throw new BadRequestException("Failed to delete user.");
    }
  }

  @Get(":token")
  async findToken(@Param("token") token: string) {
    try {
      const user = await this.userService.findToken(token);
      if (!user) throw new NotFound(`User with token ${token} not found.`);
      return user;
    } catch (error) {
      throw new BadRequestException("Failed to find user by token.");
    }
  }
}
