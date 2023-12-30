import * as child_process from "child_process";
import * as yourModule from "../index"; // 替换为实际模块路径

jest.mock("child_process");

const mockSpawn = {
  stdout: { pipe: jest.fn() },
  stderr: { pipe: jest.fn() },
  on: jest.fn(),
  kill: jest.fn(),
} as unknown as child_process.ChildProcess;

describe("yourModule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("stopAllWhisper function", () => {
    it("should kill all whisper processes", () => {
      yourModule.mainProcessMap.set("id1", mockSpawn);
      yourModule.mainProcessMap.set("id2", mockSpawn);

      yourModule.stopAllWhisper();

      expect(mockSpawn.kill).toHaveBeenCalledTimes(2);
      expect(mockSpawn.kill).toHaveBeenCalledWith("SIGTERM");
      expect(yourModule.mainProcessMap.size).toBe(0);
    });
  });

  describe("stopWhisper function", () => {
    it("should kill specific whisper process", () => {
      yourModule.mainProcessMap.set("id1", mockSpawn);

      yourModule.stopWhisper("id1");

      expect(mockSpawn.kill).toHaveBeenCalledWith("SIGTERM");
      expect(yourModule.mainProcessMap.has("id1")).toBe(false);
    });

    it("should throw error when id is not provided", () => {
      expect(() => {
        yourModule.stopWhisper("");
      }).toThrowError("stopWhisper id is required");
    });
  });
});
