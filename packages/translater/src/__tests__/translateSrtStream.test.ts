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
        translate: jest.fn().mockResolvedValue("translated text by Google"),
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

describe("TranslateModel translateSrtStream function", () => {
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

  it("removeHeaderNumberAndDot should remove header number and dot", () => {
    expect(removeHeaderNumberAndDot("1. some text")).toBe("some text");
    expect(removeHeaderNumberAndDot("1. some text")).not.toBe("1. some text");
  });

  it("translateSrtStream should translate SRT stream", async () => {
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

    const translateSpy = jest
      .spyOn(translateModel.translate, "translate")
      .mockResolvedValue("translated text");

    const translatePromise = translateModel.translateSrtStream(
      "inputPath",
      "outputPath",
      "en"
    );

    const allDataHandled = new Promise<void>((resolve) => {
      let i = 0;
      function triggerDataEvents() {
        if (i < 10) {
          const promises = dataCallbacks.map((callback) => {
            return Promise.resolve(callback({ data: { text: `some text 0` } }));
          });

          Promise.all(promises).then(() => {
            i++;
            setTimeout(triggerDataEvents, 100); // 延迟 100ms 然后再次触发
          });
        } else {
          resolve(); // 结束 Promise
        }
      }
      triggerDataEvents();
    });

    await allDataHandled;

    await translatePromise;

    expect(fakeStream.pipe).toHaveBeenCalled();
    expect(fakeStream.on).toHaveBeenCalledWith("finish", expect.any(Function));
    expect(fakeStream.write).toHaveBeenCalledWith(expect.any(String));
    expect(fakeStream.end).toHaveBeenCalled();
    expect(translateSpy).toHaveBeenCalled();
  });

  it("translateSrtStream should handle stream errors", async () => {
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
      await translateModel.translateSrtStream("inputPath", "outputPath", "en");
    } catch (e) {
      if (e instanceof Error) {
        expect(e.message).toBe("Stream error");
      }
    }

    expect(fakeStream.pipe).toHaveBeenCalled();
    expect(fakeStream.on).toHaveBeenCalledWith("error", expect.any(Function));
    expect(fakeStream.write).not.toHaveBeenCalled();
    expect(fakeStream.end).not.toHaveBeenCalled();
  });
});
