import { z } from "zod";
import { LanguageEnum } from "shared-types";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.number(),
  language: z.nativeEnum(LanguageEnum),
  path: z.string().optional(),
  processingJobId: z.string().optional(),
  poster: z.string().nullable().optional(),
});

export type Task = z.infer<typeof taskSchema>;
