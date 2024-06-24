import { Controller, Get, NotFoundException } from "@nestjs/common";
import { CustomError } from "../../err/custom/Error.filter";
import { LogDto } from "./log.dto";
import { LogService } from "./log.service";

@Controller("logs")
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  list(): LogDto[] {
    try {
      const posts = this.logService.list();
      if (posts.length === 0) {
        throw new NotFoundException("No logs found.");
      }
      return posts;
    } catch (error) {
      throw new CustomError(error.message);
    }
  }
}
