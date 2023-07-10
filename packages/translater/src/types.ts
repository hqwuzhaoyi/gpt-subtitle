export interface Translator {
  apiKey?: string;
  translate(text: string, language?: string): Promise<string>;
}
