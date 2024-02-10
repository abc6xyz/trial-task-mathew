import { z } from "zod"

export const WidgetItemSchema = z.object({
  widget_id: z.number(),
  widget_name: z.string(),
  widget_description: z.string().nullable(),
})

export type WidgetItem = z.infer<typeof WidgetItemSchema>
