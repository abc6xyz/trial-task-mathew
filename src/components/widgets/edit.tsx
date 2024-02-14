"use client"

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
import { useForm } from "react-hook-form"
import { Form } from "../ui/form"
import { z } from "zod"
import { Icons } from "../icons"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultFormValues, EditFormSchema, WidgetEditForm } from "."
import { Layout_Widgets } from "@prisma/client"
import { useState, useTransition } from "react"
import { Separator } from "../ui/separator"

type EditWidgetProps = {
  widget: Layout_Widgets;
  saveCallback: (data: any) => void;
}

export const EditWidget:React.FC<EditWidgetProps> = ({widget, saveCallback}) => {
  const { theme } = useTheme()
  const [ open, setOpen ] = useState(false)
  const [ isPending, startTransition ] = useTransition()
  
  const formSchema = EditFormSchema(widget.widget_id)
  const defaultValues = DefaultFormValues(widget.widget_id)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        saveCallback({id:widget.layout_widget_id, data:values})
      } catch (error) {
        console.error(error)
      }
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Icons.edit className={cn("absolute inset-x-full -right-[24px] top-[24px] cursor-pointer hover:fill-[#00FF00] z-10000", theme==='dark'&&"fill-[#FFFFFF]")}/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Widget</DialogTitle>
        </DialogHeader>
        <Separator className="my" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogDescription>
              <WidgetEditForm widget={widget}/>
            </DialogDescription>
            <Separator className="my-5" />
            <DialogFooter>
              <Button disabled={isPending}>
                {isPending ? (
                  <>
                    <Icons.spinner
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
                <span className="sr-only">Save widget propertise</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
