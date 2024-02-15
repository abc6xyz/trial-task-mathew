import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export const RssReaderEditForm = () => {
  return (
    <FormField
      name="url"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea placeholder="Type rss feed url..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
