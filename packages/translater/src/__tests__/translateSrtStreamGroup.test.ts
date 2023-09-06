import {
  TranslateModel,
  TranslateType,
  removeHeaderNumberAndDot,
} from "../index";
import * as fs from "fs";

jest.mock("fs");

jest.mock("../google", () => {
  return {
    GoogleTranslator: jest.fn().mockImplementation(() => {
      return {
        translate: jest
          .fn()
          .mockResolvedValue(
            "1.translated text by Google\n2.translated text by Google\n3.translated text by Google\n4.translated text by Google"
          ),
      };
    }),
  };
});

jest.mock("../gpt3", () => {
  return {
    GPTTranslator: jest.fn().mockImplementation(() => {
      return {
        translate: jest.fn().mockResolvedValue("translated text by GPT3"),
      };
    }),
  };
});

describe("TranslateModel translateSrtStreamGroup function", () => {
  let translateModel: TranslateModel;

  beforeEach(() => {
    // Initialize
    translateModel = new TranslateModel(TranslateType.GOOGLE, {
      googleKey: "testGoogleKey",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize streams correctly", async () => {
    let dataCallbacks = [];
    const fakeStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "finish") {
          callback();
        } else if (event === "data") {
          // 模拟一些数据，以触发translate调用
          dataCallbacks.push(callback);
        }
        return fakeStream;
      }),
      createReadStream: jest.fn().mockReturnThis(),
      createWriteStream: jest.fn().mockReturnThis(),
      write: jest.fn(),
      end: jest.fn(),
    };

    jest
      .spyOn(fs, "createReadStream")
      .mockImplementation(() => fakeStream as any);
    jest
      .spyOn(fs, "createWriteStream")
      .mockImplementation(() => fakeStream as any);

    await translateModel.translateSrtStreamGroup(
      "inputPath",
      "outputPath",
      "en"
    );

    expect(fs.createReadStream).toHaveBeenCalledWith("inputPath", {
      encoding: "utf8",
    });
    expect(fs.createWriteStream).toHaveBeenCalledWith("outputPath", {
      encoding: "utf8",
    });
  });

  it("should call translate function with correct parameters", async () => {
    let dataCallbacks = [];
    const fakeStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "finish") {
          callback();
        } else if (event === "data") {
          // 模拟一些数据，以触发translate调用
          callback({ data: { text: `some text` }, type: "cue" });
        }
        return fakeStream;
      }),
      createReadStream: jest.fn().mockReturnThis(),
      createWriteStream: jest.fn().mockReturnThis(),
      write: jest.fn(),
      end: jest.fn(),
    };

    jest
      .spyOn(fs, "createReadStream")
      .mockImplementation(() => fakeStream as any);
    jest
      .spyOn(fs, "createWriteStream")
      .mockImplementation(() => fakeStream as any);

    const translateSpy = jest
      .spyOn(translateModel.translate, "translate")
      .mockResolvedValue("translated text");

    for (let i = 0; i < 3; i++) {
      for (const callback of dataCallbacks) {
        callback({ data: { text: `some text ${i}` }, type: "cue" });
      }
    }

    await translateModel.translateSrtStreamGroup(
      "inputPath",
      "outputPath",
      "en"
    );

    // 断言
    expect(translateSpy).toHaveBeenCalled();
  });

  it("translateSrtStreamGroup should filter repeat node", async () => {
    // 第一次调用，应返回 true
    let result = translateModel.filterFunc({
      type: "cue",
      data: { text: "text1", end: 10 },
    });
    expect(result).toBe(true);

    // 与上一个节点不同，应返回 true
    result = translateModel.filterFunc({
      type: "cue",
      data: { text: "text2", end: 20 },
    });
    expect(result).toBe(true);

    // 与上一个节点相同，应返回 false
    result = translateModel.filterFunc({
      type: "cue",
      data: { text: "text2", end: 30 },
    });
    expect(result).toBe(false);

    // 验证 lastNode 的值被正确更新
    expect(translateModel.filterLastNode.data.end).toBe(30);
    expect(translateModel.filterLastNode.merged).toBe(true);
  });

  it("translateSrtStreamGroup should translate SRT stream in groups", async () => {
    let dataCallbacks = [];
    let fakeData = [
      { data: { text: "some text 1" }, type: "cue" },
      { data: { text: "some text 2" }, type: "cue" },
      { data: { text: "some text 4" }, type: "cue" },
      { data: { text: "some text 4" }, type: "cue" },
      { data: { text: "some text 4" }, type: "cue" },
      // ...更多模拟数据
    ];

    const fakeStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "finish") {
          callback();
        } else if (event === "data") {
          // 模拟一些数据，以触发translate调用
          dataCallbacks.push(callback);
        }
        return fakeStream;
      }),
      createReadStream: jest.fn().mockReturnThis(),
      createWriteStream: jest.fn().mockReturnThis(),
      write: jest.fn(),
      end: jest.fn(),
    };

    jest
      .spyOn(fs, "createReadStream")
      .mockImplementation(() => fakeStream as any);
    jest
      .spyOn(fs, "createWriteStream")
      .mockImplementation(() => fakeStream as any);

    // const allDataHandled = new Promise<void>((resolve) => {
    //   let i = 0;
    //   function triggerDataEvents() {
    //     if (i < 10) {
    //       const promises = dataCallbacks.map((callback) => {
    //         return Promise.resolve(
    //           callback({ data: { text: `some text repeat` }, type: "cue" })
    //         );
    //       });

    //       Promise.all(promises).then(() => {
    //         i++;
    //         setTimeout(triggerDataEvents, 100); // 延迟 100ms 然后再次触发
    //       });
    //     } else {
    //       resolve(); // 结束 Promise
    //     }
    //   }
    //   triggerDataEvents();
    // });

    const translatePromise = translateModel.translateSrtStreamGroup(
      "inputPath",
      "outputPath",
      "en"
    );

    const triggerDataEvents = async () => {
      for (const data of fakeData) {
        const promises = dataCallbacks.map(async (callback) => {
          await callback(data);
        });
        await Promise.all(promises);
      }
    };

    await triggerDataEvents();
    // await allDataHandled;

    const result = await translatePromise;

    // 断言
    expect(result).toBe("outputPath");

    // TODO: 可以加更多的断言来验证翻译缓存、PQueue 的行为等
  });

  it("translateSrtStreamGroup should handle stream errors", async () => {
    const fakeStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "error") {
          callback(new Error("Stream error"));
        }
        return fakeStream;
      }),
      createReadStream: jest.fn().mockReturnThis(),
      createWriteStream: jest.fn().mockReturnThis(),
      write: jest.fn(),
      end: jest.fn(),
    };

    jest
      .spyOn(fs, "createReadStream")
      .mockImplementation(() => fakeStream as any);
    jest
      .spyOn(fs, "createWriteStream")
      .mockImplementation(() => fakeStream as any);

    try {
      await translateModel.translateSrtStreamGroup(
        "inputPath",
        "outputPath",
        "en"
      );
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toBe("Stream error");
      }
    }
    expect(fakeStream.on).toHaveBeenCalledWith("error", expect.any(Function));
  });
});
