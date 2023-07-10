import { Translator } from "./types";
import { v2 } from "@google-cloud/translate";

export class GoogleTranslator implements Translator {
  google: v2.Translate;

  constructor(params: { apiKey?: string } = {}) {
    const google = new v2.Translate({ key: params.apiKey });
    this.google = google;
  }

  public async translate(text: string, language): Promise<string> {
    const [translatedText] = await this.google.translate(text, language);
    return translatedText;
  }
}
