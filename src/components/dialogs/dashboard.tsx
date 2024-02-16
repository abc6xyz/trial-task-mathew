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
import { Widget } from "@prisma/client"
import { Skeleton } from "../ui/skeleton"
import { Icons } from "../icons"

const formSchema = z.object({
  title: z.string().min(1),
  widgets: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one widget.",
  }),
})

export const DashboardDialog = () => {
  const { isOpen, setSelectedLayout, setLayouts } = useSidebar()
  const [ open, setOpen ] = useState(false)
  const [ widgets, setWidgets ] = useState<Widget[] | null>(null)
  const [ isPending, startTransition ] = useTransition()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      widgets: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch('/api/layout/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data:{
              title: values.title,
              widgets: values.widgets,
            }}),
        });
        const result = await response.json();
        if ('error' in result){
          toast({
            title: result['error'],
          })
        } else {
          const resp = await fetch('/api/layout')
          const resu = await resp.json();
          setLayouts(resu['data'])
          setSelectedLayout(result['data']['layout_id'])
          setOpen(false)
          form.reset()
          toast({
            title: "Success",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(result, null, 2)}</code>
              </pre>
            ),
          })
        }
      } catch (error) {
        toast({
          title: 'Error fetching data from API',
        })
      }
    })
  }

  useEffect(() => {
    const getAllWidgets_ = async () => {
      const response = await fetch('/api/widget')
      const result = await response.json()
      setWidgets(result['data'])
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
                  <Skeleton className="h-[250px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-8 w-[200px]" />
                  </div>
                </div>
              }
            </DialogDescription>
            <Separator className="my-5" />
            <DialogFooter>
              <div className="flex space-x-8 items-center">
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
