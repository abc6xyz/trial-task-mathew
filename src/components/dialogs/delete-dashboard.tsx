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
import { useDashboard } from "@/providers/dashboardProvider"
import { useEffect, useMemo, useState, useTransition } from "react"
import { Icons } from "../icons"
import { Form, useForm } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { deleteUserLayout } from "@/app/actions/layout"
import { toast } from "../ui/use-toast"

export function DeleteDashboard() {
  const [ open, setOpen ] = useState(false)
  const { selectedLayout, layouts } = useDashboard()
  const [isPending, startTransition] = useTransition()

  const layout_name = 
    layouts?.find(layout => layout?.layout_id === selectedLayout)?.layout_name
  
  const formSchema = z.object({
    dashboard: z.string().refine(data => data === "dashboard/"+layout_name, {
      message: `The string must be "dashboard/+${layout_name}"`,
  })})
    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dashboard: ""
    },
  })
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
    if (values.dashboard !== "dashboard/"+layout_name) return
    startTransition(async () => {
      const res = await deleteUserLayout(selectedLayout)
      if ( res ) {
        toast({
          title: "Deleted!",
          description: "The dashboard successfully has been deleted",
        })
      } 
      else {
        toast({
          title: "Fialed to delete dashboard",
          description: "Please try again",
          variant: "destructive",
        })
      }
    })
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete dashboard</DialogTitle>
          <DialogDescription>
            <div className="flex">
              To confirm, type "<div className="text-red-500">dashboard/{layout_name}</div>" in the box below
            </div>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid w-full gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="dashboard"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="destructive" disabled={isPending}>
                {isPending ? (
                  <>
                    <Icons.spinner
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
                <span className="sr-only">Delete dashboard by its name</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
