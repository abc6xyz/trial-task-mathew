"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebar } from "@/hooks/useSidebar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  title: z.string(),
})

export const DashboardDialog = () => {
  const { isOpen } = useSidebar()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={cn( "duration-500", isOpen ? 'p-5' : 'py-5' )}>
          <Button className="w-full">
            { !isOpen ? '+'
              : 'Create Dashboard'
            }
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <div className="pb-3 border-b">
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>
              Create new dashboard with your desired widgets.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="New Dashboard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create</Button>
            </form>
          </Form>
          <ScrollArea className="h-[500px] w-full md:mb-3 ml-3 md:boder-b border-l">
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
