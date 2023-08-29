const mockCreate = jest.fn().mockResolvedValue({
  choices: [{ message: { content: "mockTranslatedText" } }],
});

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };
  });
});

import { GPTTranslator } from "../gpt3";

describe("GPTTranslator", () => {
  let gptTranslator: GPTTranslator;

  beforeEach(() => {
    gptTranslator = new GPTTranslator({
      baseUrl: "http://fake-base-url.com",
      apiKey: "fakeApiKey",
    });
  });

  it("should construct without errors", () => {
    expect(gptTranslator).toBeInstanceOf(GPTTranslator);
  });

  it("should translate text", async () => {
    const translatedText = await gptTranslator.translate("hello", "Chinese");
    expect(translatedText).toBe("mockTranslatedText");
  });
  it("should handle errors properly", async () => {
    mockCreate.mockRejectedValue(new Error("Some error message")); // 设置 mockCreate 抛出一个错误
    await expect(gptTranslator.translate("hello")).rejects.toThrow(
      "Some error message"
    );
  });
});

describe("generatePrompt", () => {
  it("should return a properly formatted string", () => {
    const translator = new GPTTranslator();
    const result = translator.generatePrompt("bear");
    expect(result).toContain("Animal: Bear");
  });
});
