import { z } from "zod"

export const LayoutItemSchema = z.object({
  layout_id: z.number(),
  user_id: z.number(),
  layout_name: z.string()
})

export type LayoutItem = z.infer<typeof LayoutItemSchema>
