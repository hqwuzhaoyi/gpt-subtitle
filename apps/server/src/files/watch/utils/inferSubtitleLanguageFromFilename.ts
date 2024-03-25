import { LanguageEnum, subtitleExtensionsRegex } from "shared-types";

// 将所有的语言枚举值合并成一个正则表达式
const languageCodes = Object.values(LanguageEnum).join("|").toLowerCase();

// 解析文件名以推断语言
export function inferLanguageFromFilename(
  filename: string
): LanguageEnum | "unknown" {
  // 首先，将文件名转换为小写并移除字幕后缀（如果有）
  let processedFilename = filename
    .toLowerCase()
    .replace(subtitleExtensionsRegex, "");

  // 构建正则表达式以匹配以_或.开头的任一语言代码
  const languageRegex = new RegExp(`[_\.](${languageCodes})($|[_\.])`, "i");

  const match = processedFilename.match(languageRegex);
  if (match && match[1]) {
    // 返回匹配到的语言代码对应的枚举值
    // 注意：由于枚举值可能是大写，这里需要正确映射回枚举
    const code = match[1];
    return (code as LanguageEnum) || "unknown";
  }

  return "unknown";
}
