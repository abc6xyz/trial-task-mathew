import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export const EmbeddedWidgetEditForm = () => {
  return (
    <FormField
      name="iframe"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea placeholder="Type iframe src..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
