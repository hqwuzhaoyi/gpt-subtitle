import { LanguageEnum } from "shared-types";
import { inferLanguageFromFilename } from "./inferSubtitleLanguageFromFilename";

describe("inferLanguageFromFilename", () => {
  it("should return the correct language key when a matching code is found", () => {
    const filename = "example_en.srt";
    const zhFilename = "Day Shift (2022) WEBDL-1080p Proper.zh.srt";
    const result = inferLanguageFromFilename(filename);
    expect(result).toBe(LanguageEnum.English);
    const zhResult = inferLanguageFromFilename(zhFilename);
    expect(zhResult).toBe(LanguageEnum.Chinese);
  });

  it('should return "Unknown" when no matching code is found', () => {
    const filename = "example_xfr.srt";
    const result = inferLanguageFromFilename(filename);
    expect(result).toBe("unknown");
  });

  // Add more test cases for different scenarios
});
