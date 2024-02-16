import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export const CryptoChartEditForm = () => {
  return (
    <FormField
      name="coin"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input placeholder="Type coin id... (ex: bitcoin)" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
