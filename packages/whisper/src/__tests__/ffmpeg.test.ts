describe("extractAudio function", () => {
  it("should execute without errors", () => {
    jest.isolateModules(() => {
      const spawnMock = {
        stdout: { pipe: jest.fn() },
        stderr: { pipe: jest.fn() },
        on: jest.fn(),
      };

      jest.doMock("child_process", () => ({
        spawn: jest.fn().mockReturnValue(spawnMock),
        exec: jest.fn(),
      }));

      const { extractAudio } = require("../index"); // 替换成你的模块路径

      const promise = extractAudio("targetPath", "audioPath");

      // 触发 'close' 事件以解决 promise
      spawnMock.on.mock.calls.find(([eventName]) => eventName === "close")[1]();

      return expect(promise).resolves.toBeUndefined();
    });
  });

  it("should handle errors", () => {
    jest.isolateModules(() => {
      const spawnMock = {
        stdout: { pipe: jest.fn() },
        stderr: { pipe: jest.fn() },
        on: jest.fn(),
      };

      jest.doMock("child_process", () => ({
        spawn: jest.fn().mockReturnValue(spawnMock),
        exec: jest.fn(),
      }));

      const { extractAudio } = require("../index"); // 替换成你的模块路径

      const promise = extractAudio("targetPath", "audioPath");

      // 触发 'error' 事件以拒绝 promise
      const error = new Error("some error");
      spawnMock.on.mock.calls.find(([eventName]) => eventName === "error")[1](
        error
      );

      return expect(promise).rejects.toThrow("some error");
    });
  });
});
