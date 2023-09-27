import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const AlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  path: z.string().optional(),
  processingJobId: z.string().optional(),
  cover: z.string().nullable().optional(),
});

export type Album = z.infer<typeof AlbumSchema>;
