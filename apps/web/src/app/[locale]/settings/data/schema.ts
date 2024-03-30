import * as z from "zod";
import { TranslateType, TranslateLanguage, LanguageEnum } from "shared-types";

export const profileFormSchema = z.object({
  OUTPUT_SRT_THEN_TRANSLATE: z.boolean().optional(),
  TranslateModel: z.nativeEnum(TranslateType).optional(),
  LANGUAGE: z.nativeEnum(TranslateLanguage).optional(),
  TRANSLATE_GROUP: z.number().optional(),
  TRANSLATE_DELAY: z.number().optional(),
  PreferredLanguage: z.number().optional(),
  AUTO_START_PREFERRED_LANGUAGE: z.nativeEnum(LanguageEnum).optional(),
  AUTO_START_FILTER: z.boolean().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const WhisperSchema = z.object({
  // whisperPath: z.string(),
  model: z.string(),
  videoLanguage: z.nativeEnum(LanguageEnum),
  maxContent: z.number().optional().default(-1),
  entropyThold: z.number().optional().default(2.4),
  prompt: z.string().optional(),
  threads: z.number().optional(),
});

export type WhisperValues = z.infer<typeof WhisperSchema>;
