import { LogDto } from "./log.dto";
import { LogService } from "./log.service";

describe("LogService", () => {
  let service: LogService;

  beforeEach(() => {
    service = new LogService();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should add a log to the list", () => {
      const log: LogDto = { routeName: "Test Route", method: "GET", duration: 100, time: "2024-06-21T12:00:00.000Z" };

      service.create(log);

      expect(service.list()).toEqual([log]);
    });
  });

  describe("list", () => {
    it("should return the list of logs", () => {
      const logs: LogDto[] = [
        { routeName: "Route 1", method: "GET", duration: 100, time: "2024-06-21T12:00:00.000Z" },
        { routeName: "Route 2", method: "POST", duration: 200, time: "2024-06-21T13:00:00.000Z" },
      ];

      logs.forEach(log => service.create(log));

      expect(service.list()).toEqual(logs);
    });

    it("should return an empty array if no logs have been added", () => {
      expect(service.list()).toEqual([]);
    });
  });
});
