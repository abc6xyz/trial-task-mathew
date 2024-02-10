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
import { useSidebar } from "@/hooks/useSidebar"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Separator } from "../ui/separator"
import { WidgetsPreview } from "../widgets-preview"
import { Label } from "@radix-ui/react-label"
import { toast } from "../ui/use-toast"
import { useEffect, useState, useTransition } from "react"
import { getAllWidgets } from "@/app/actions/widget"
import { WidgetItem } from "@/validations/widget"
import { Skeleton } from "../ui/skeleton"
import { setUserLayout } from "@/app/actions/layout"
import { useSession } from "next-auth/react"
import { Icons } from "../icons"
import { useDashboard } from "@/providers/dashboardProvider"

const formSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

export const DashboardDialog = () => {
  const { isOpen } = useSidebar()
  const [ open, setOpen ] = useState(false)
  const [ widgets, setWidgets ] = useState<WidgetItem[] | null>(null)
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const { fetchLayouts } = useDashboard()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      items: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // })
    startTransition(async () => {
      const res = await setUserLayout(session?.user?.email, values.title, values.items)
      if (res) {
        setOpen(false)
        fetchLayouts()
        toast({
          title: "Success",
          description: "Created new dashboard successfully"
        })
      }
    })
  }

  useEffect(() => {
    const getAllWidgets_ = async () => {
      const res = await getAllWidgets()
      if (res){
        setWidgets(res)
      }
    }
    if(open){
      setWidgets(null)
      getAllWidgets_()
    }
  },[open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <DialogHeader>
          <DialogTitle>Create New Dashboard</DialogTitle>
          <DialogDescription>
            Create new dashboard with your desired widgets.
          </DialogDescription>
        </DialogHeader>
        <Separator className="my" />
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogDescription className="flex">
              { widgets?
                <WidgetsPreview widgets={widgets} />
                :
                <div className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              }
            </DialogDescription>
            <Separator className="my" />
            <DialogFooter>
              <div className="mt-5 flex space-x-8 items-center">
                <Label> Dashboard Title : </Label>
                <FormField
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="New Dashboard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isPending}>
                  {isPending ? (
                    <>
                      <Icons.spinner
                        className="mr-2 size-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create</span>
                  )}
                  <span className="sr-only">Create dashboard with desired widgets</span>
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
