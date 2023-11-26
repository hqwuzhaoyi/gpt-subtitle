describe("Configuration", () => {
  let originalEnv;

  beforeEach(() => {
    // 存储当前的环境变量
    originalEnv = { ...process.env };
    jest.resetModules();
  });

  afterEach(() => {
    // 恢复原始环境变量
    process.env = originalEnv;
  });

  it("should set staticPath based on environment variables", () => {
    // Mock environment variables
    Object.defineProperty(process.env, "API_URL", {
      value: "http://test.com",
      writable: true,
    });
    Object.defineProperty(process.env, "STATIC_PATH", {
      value: "/test_static",
      writable: true,
    });

    const config = require("../index"); // 替换为你的模块路径

    expect(config.staticPath).toBe("http://test.com/test_static/");
  });

  it("should set videoDirPath based on environment variables", () => {
    // Mock environment variables
    Object.defineProperty(process.env, "API_URL", {
      value: "http://test.com",
      writable: true,
    });
    Object.defineProperty(process.env, "STATIC_PATH", {
      value: "/test_static",
      writable: true,
    });

    const config = require("../index"); // 替换为你的模块路径

    expect(config.videoDirPath).toBe("http://test.com/test_static/video/");
  });
});
