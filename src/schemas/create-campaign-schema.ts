import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string(),
  content: z.string(),
  listId: z.number(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  startTimeAt: z.string().optional(),
  endTimeAt: z.string().optional(),
});

export type CreateCampaignSchemaProps = z.infer<typeof createCampaignSchema>;
