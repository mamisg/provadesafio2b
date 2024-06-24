import { NotFoundException } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { LogDto } from './log.dto';
import { Test } from '@nestjs/testing';
import { CustomError } from '../../err/custom/Error.filter';

describe("LogController", () => {
  let controller: LogController;
  let service: LogService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LogController],
      providers: [LogService],
    }).compile();

    controller = moduleRef.get<LogController>(LogController);
    service = moduleRef.get<LogService>(LogService);
  });

  describe("list", () => {
    it("should return a list of logs when there are logs", async () => {
      jest.spyOn(service, "list").mockResolvedValue([] as never);
  
      const result = await controller.list();
      expect(result).toEqual([]);
    });
      
    it("should throw a CustomError when an error occurs", async () => {
      const errorMessage = "An error occurred.";
      jest.spyOn(service, "list").mockRejectedValue(new CustomError(errorMessage) as never);
  
      await expect(controller.list()).rejects.toThrow(CustomError);
    });
  });
  
});
