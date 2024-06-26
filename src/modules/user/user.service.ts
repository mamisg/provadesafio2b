import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { CustomError } from "../../err/custom/Error.filter";
import { prisma } from "../../prisma/prisma-connection";
import { UserDto } from "./user.dto";

@Injectable()
export class UserService {
  async create(data: UserDto) {
    const { name, email, password, token } = data;

    const existEmail = await prisma.user.findFirst({
      where: { email: data.email, id: { not: data.id } },
    });
    if (existEmail) throw new CustomError("E-mail already registered");

    return prisma.user.create({
      data: {
        name,
        email,
        password,
        token,
      },
    });
  }

  async update(id: string, user: UserDto) {
    const { ...data } = user;

    if (!id) throw new CustomError("User ID is required for updating.");
    const updated = new Date();

    const userId = await prisma.user.findUnique({
      where: { id },
    });
    if (!userId) throw new CustomError(`User ID ${id} not found`);

    const existEmail = await prisma.user.findFirst({
      where: { email: data.email, id: { not: id } },
    });
    if (existEmail) throw new CustomError("E-mail already registered");

    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updated,
      },
    });
  }

  async list() {
    return prisma.user.findMany();
  }

  async delete(id: string) {
    if (!id) throw new CustomError("User ID was not found");

    return prisma.user.delete({ where: { id } });
  }

  async updateToken(user: User) {
    const { id, ...data } = user;
    if (!id) throw new CustomError("User ID is required for updating.");
    const updated = new Date();

    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updated,
      },
    });
  }

  async findEmail(email: string) {
    const existEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (!existEmail) return undefined;
    return existEmail;
  }

  async countUser() {
    return prisma.user.count();
  }

  async findToken(token: string) {
    if (token !== "") {
      const existToken = await prisma.user.findFirst({
        where: { token },
      });

      if (!existToken) return undefined;
      return existToken;
    } else return undefined;
  }
}
