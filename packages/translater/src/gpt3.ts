import OpenAI from "openai";
import { Translator } from "./types";

export class GPTTranslator implements Translator {
  model: OpenAI;
  baseUrl: string;
  apiKey: string;
  constructor(params: { baseUrl?: string; apiKey?: string } = {}) {
    this.baseUrl = params.baseUrl;
    this.apiKey = params.apiKey;
    this.create();
  }

  create() {
    const openai = new OpenAI({
      baseURL: this.baseUrl ?? process.env.BASE_URL,
      apiKey: this.apiKey ?? process.env.OPENAI_API_KEY,
    });

    this.model = openai;
  }

  generatePrompt(animal: string) {
    const capitalizedAnimal =
      animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Suggest three names for an animal that is a superhero.

    Animal: Cat
    Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
    Animal: Dog
    Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
    Animal: ${capitalizedAnimal}
    Names:`;
  }

  async translate(text, language = "Chinese") {
    try {
      const completion = await this.model.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.6,
        messages: [
          { role: "system", content: "" },
          {
            role: "user",
            content: `Please help me to translate,\`${text}\` to ${language}, please return only translated content not include the origin text, and do not change the symbols,and keep line breaks `,
          },
        ],
      });

      console.log("translate result: ", completion.choices[0].message.content);
      return completion.choices[0].message.content;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
