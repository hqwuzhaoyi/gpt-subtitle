import * as z from "zod";
import { TranslateType, TranslateLanguage } from "shared-types";

export const profileFormSchema = z.object({
  OUTPUT_SRT_THEN_TRANSLATE: z.boolean().optional(),
  TranslateModel: z.nativeEnum(TranslateType).optional(),
  LANGUAGE: z.nativeEnum(TranslateLanguage).optional(),
  TRANSLATE_GROUP: z.number().optional(),
  TRANSLATE_DELAY: z.number().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
