import { LanguageEnum, subtitleExtensionsRegex } from "shared-types";

const languageCodeExtends = {
  Chinese: "chi|中",
  English: "eng|en|英",
};

// 将所有的语言枚举值合并成一个正则表达式
const languageCodes = [
  ...Object.values(LanguageEnum).map((value) => value.toLowerCase()),
  ...Object.values(languageCodeExtends).flatMap((codes) => codes.split("|"))
].join("|");

// 解析文件名以推断语言
export function inferLanguageFromFilename(
  filename: string
): LanguageEnum | "unknown" {
  // 首先，将文件名转换为小写并移除字幕后缀（如果有）
  let processedFilename = filename
    .toLowerCase()
    .replace(subtitleExtensionsRegex, "");

  // 构建正则表达式以匹配以_或.开头的任一语言代码
  const languageRegex = new RegExp(`[._](${languageCodes})(?=[^._]*[._]|$)`, "i");

  console.log("processedFilename", processedFilename);
  console.log("languageRegex", languageRegex);

  const match = processedFilename.match(languageRegex);
  console.log("match", match);
  if (match && match[1]) {
    const matchedCode = match[1];

    // 查找匹配到的语言代码属于哪个语言扩展
    const matchedEnumKey = Object.entries(languageCodeExtends).find(([key, value]) =>
      new RegExp(value, "i").test(matchedCode)
    )?.[0];

    if (matchedEnumKey) {
      // 如果找到匹配的扩展，返回对应的LanguageEnum值
      return LanguageEnum[matchedEnumKey];
    } else {
      // 如果没有找到匹配的扩展，尝试直接从LanguageEnum返回
      const directMatch = Object.values(LanguageEnum).find(value =>
        value.toLowerCase() === matchedCode
      );
      return directMatch || "unknown";
    }
  }

  return "unknown";
}
