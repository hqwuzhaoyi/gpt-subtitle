import { TranslateModel, TranslateType } from "../index";
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

describe("TranslateModel", () => {
  let translateModel: TranslateModel;

  beforeEach(() => {
    // Initialize
    translateModel = new TranslateModel(TranslateType.GOOGLE, {
      googleKey: "testGoogleKey",
    });
  });

  it("should translate SRT stream", async () => {
    const fakeStream = {
      pipe: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "finish") {
          callback();
        } else if (event === "data") {
          // 模拟一些数据，以触发translate调用
          callback({ data: { text: "some text" } });
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

    await translateModel.translateSrtStream("inputPath", "outputPath", "en");

    expect(fakeStream.pipe).toHaveBeenCalled();
    expect(fakeStream.on).toHaveBeenCalledWith("finish", expect.any(Function));
    expect(fakeStream.write).toHaveBeenCalledWith(expect.any(String));
    expect(fakeStream.end).toHaveBeenCalled();
    expect(translateSpy).toHaveBeenCalled();
  });
});
