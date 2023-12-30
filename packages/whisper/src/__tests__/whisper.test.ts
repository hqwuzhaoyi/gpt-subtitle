import * as child_process from "child_process";
import * as whipserModule from "../index"; // 替换为实际模块路径
import path from "path";

jest.mock("child_process");

describe("whisper function", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 这会重置所有的mocks
  });

  it("should spawn a child process and handle events", async () => {
    const mockSpawn = {
      stdout: {
        pipe: jest.fn(),
        on: jest.fn(),
      },
      stderr: {
        pipe: jest.fn(),
        on: jest.fn(),
      },
      on: jest.fn((event, cb) => {
        if (event === "close") {
          cb(0); // exit code
        }
      }),
    };
    (child_process.spawn as jest.Mock).mockReturnValue(mockSpawn);

    const result = await whipserModule.whisper("targetPath1", "videoLanguage");

    const whisperRoot = path.join(__dirname, "..", "..", "..", "..", "whisper");
    console.log("whisperRoot", whisperRoot);

    const model = "ggml-medium.bin";

    const mainPath = path.join(whisperRoot, "main");
    const modelPath = path.join(whisperRoot, "models", model);

    expect(child_process.spawn).toHaveBeenCalledWith(
      mainPath,
      ["-f", '"targetPath1"', "-osrt", "-l", "videoLanguage", "-m", modelPath],
      { shell: true }
    );
    expect(result).toBe(0); // expect resolved promise to be 0
  });

  it("should not spawn a child process if one already exists", async () => {
    const mockSpawn = {
      stdout: {
        pipe: jest.fn(),
        on: jest.fn(),
      },
      stderr: {
        pipe: jest.fn(),
        on: jest.fn(),
      },
      on: jest.fn((event, cb) => {
        if (event === "close") {
          cb(0); // exit code
        }
      }),
    };
    (child_process.spawn as jest.Mock).mockReturnValue(mockSpawn);

    whipserModule.mainProcessMap.set("notBeCalled", mockSpawn as any);
    whipserModule.whisper(
      "targetPath2",
      "videoLanguage",
      "ggml-medium.bin",
      "notBeCalled"
    );

    expect(child_process.spawn).not.toHaveBeenCalled();
  });

  it("should sendEvent when whisper", async () => {
    const mockSpawn = {
      stdout: {
        pipe: jest.fn(),
        on: jest.fn().mockImplementation((event, cb) => {
          if (event === "data") {
            cb("data");
          }
        }),
      },
      stderr: {
        pipe: jest.fn(),
        on: jest.fn().mockImplementation((event, cb) => {
          if (event === "data") {
            cb("data");
          }
        }),
      },
      on: jest.fn((event, cb) => {
        if (event === "close") {
          cb(0); // exit code
        }
      }),
    };
    (child_process.spawn as jest.Mock).mockReturnValue(mockSpawn);

    const mockSendEvent = jest.fn();

    await whipserModule.whisper(
      "targetPath3",
      "videoLanguage",
      "ggml-medium.bin",
      "mockSendEvent",
      mockSendEvent
    );

    expect(mockSendEvent).toHaveBeenCalled();
  });

  it("should handle exit event", async () => {
    const mockSpawn = {
      stdout: {
        on: jest.fn(),
      },
      stderr: {
        on: jest.fn(),
      },
      on: jest.fn(function (event, cb) {
        if (event === "exit") {
          this.exitCallback = cb; // 保存回调以便后续调用
          cb(0, "SIGTERM");
        }
      }),
      triggerExit: function (code, signal) {
        this.exitCallback && this.exitCallback(code, signal); // 触发exit事件
      },
      exitCallback: null,
    };
    (child_process.spawn as jest.Mock).mockReturnValue(mockSpawn);

    const promise = whipserModule.whisper("targetPath", "videoLanguage"); // 保存Promise对象

    // 触发exit事件，并传递参数
    mockSpawn.triggerExit(0, "SIGTERM");

    // 等待Promise完成
    const result = await promise;

    // 这里添加你的断言来验证代码的行为。例如：
    expect(result).toBe("SIGTERM"); // 根据你的实际代码修改
    expect(whipserModule.mainProcessMap.has("main")).toBe(false);
  });

  it("should throw error when whisper", async () => {
    const mockSpawn = {
      stdout: {
        pipe: jest.fn(),
        on: jest.fn(),
      },
      stderr: {
        pipe: jest.fn(),
        on: jest.fn(),
      },
      on: jest.fn((event, cb) => {
        if (event === "error") {
          cb(new Error("error"));
        }
      }),
    };
    (child_process.spawn as jest.Mock).mockReturnValue(mockSpawn);

    const mockSendEvent = jest.fn();

    await expect(
      whipserModule.whisper(
        "targetPath4",
        "videoLanguage",
        "ggml-medium.bin",
        "mockSendEvent",
        mockSendEvent
      )
    ).rejects.toThrowError("error");
  });
});

// 以下类似地测试其他函数，例如 stopAllWhisper, stopWhisper, extractAudio
