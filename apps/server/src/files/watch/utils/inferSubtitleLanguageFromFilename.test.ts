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

  it('chinese should be matched with "中"', () => {
    const filename = 'John.Wick.Chapter.4.2023.2160p.WEB-DL.DDP5.1.Atmos.HDR10Plus.H.265-CM.chinese(简,shooter).default';
    const result = inferLanguageFromFilename(filename);
    expect(result).toBe(LanguageEnum.Chinese);
  });

  it('should return "Unknown" when no matching code is found', () => {
    const filename = "example_xfr.srt";
    const result = inferLanguageFromFilename(filename);
    expect(result).toBe("unknown");
  });

  // Add more test cases for different scenarios
});
