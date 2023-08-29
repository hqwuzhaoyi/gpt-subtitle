// 在文件顶部
jest.mock("@google-cloud/translate", () => ({
    v2: {
      Translate: jest.fn(() => ({
        translate: jest.fn().mockResolvedValue(["mockTranslatedText"]),
      })),
    },
  }));

  import { GoogleTranslator } from "../google";

  describe("GoogleTranslator", () => {
    let googleTranslator: GoogleTranslator;

    beforeEach(() => {
      googleTranslator = new GoogleTranslator({ apiKey: "fakeApiKey" });
    });

    it("should construct without errors", () => {
      expect(googleTranslator).toBeInstanceOf(GoogleTranslator);
    });

    it("should translate text", async () => {
      const translatedText = await googleTranslator.translate("hello", "es");
      expect(translatedText).toBe("mockTranslatedText");
    });
  });
