import fs from "fs";
import { parseStringPromise } from "xml2js";

export async function parser(filePath: string) {
  const nfoContent = fs.readFileSync(filePath, "utf8");
  const data = await parseStringPromise(nfoContent);

  return Object.values(data)?.[0];
}
