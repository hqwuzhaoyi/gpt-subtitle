import { GoogleTranslator } from "../google";
import { TranslateType, TranslateOptions, TranslateModel } from "../index"; // 假设你的翻译器类叫做 Translator
import { GPTTranslator } from "../gpt3";

jest.mock("openai", () => {
  return jest.fn();
});

describe("Translator", () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    if (spy) {
      spy.mockRestore();
    }
  });

  it("should create a GoogleTranslator when type is GOOGLE", () => {
    const options: TranslateOptions = {
      googleKey: "fake-google-key",
      gpt3Key: "fake-gpt3-key",
    };
    const translator = new TranslateModel(TranslateType.GOOGLE, options);

    expect(translator.translate).toBeInstanceOf(GoogleTranslator);
  });

  it("should create a GPTTranslator when type is GPT3", () => {
    const options: TranslateOptions = {
      googleKey: "fake-google-key",
      gpt3Key: "fake-gpt3-key",
    };
    const translator = new TranslateModel(TranslateType.GPT3, options);

    expect(translator.translate).toBeInstanceOf(GPTTranslator);
  });
});
