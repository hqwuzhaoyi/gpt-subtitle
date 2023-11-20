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
  title: z.string().optional().nullable(),
  originaltitle: z.string().optional().nullable(),
  plot: z.string().optional().nullable(),
  actors: z
    .array(
      z.object({ name: z.string().optional(), role: z.string().optional() })
    )
    .optional()
    .nullable(),
  dateadded: z.string().optional().nullable(),
  poster: z.string().optional().nullable(),
  fanart: z.string().optional().nullable(),
});

export type Album = z.infer<typeof AlbumSchema>;
