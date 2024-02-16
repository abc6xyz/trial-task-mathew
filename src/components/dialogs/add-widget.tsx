"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetPreview } from "@/components/widgets"
import { cn } from "@/lib/utils"
import { Widget } from "@prisma/client"
import { ScrollArea } from "../ui/scroll-area";

type AddWidgetProps = {
  onAddCallback: (widget_id: number) => void;
}

export function AddWidget({onAddCallback}: AddWidgetProps) {
  const { theme } = useTheme()
  const [ open, setOpen ] = useState(false)
  const [ widgets, setWidgets ] = useState<Widget[] | null>(null)

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Add</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add widgets</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-full">
          { widgets?
            <div className="space-y-5">
              { widgets.length?
                widgets.map((widget) => (
                  <div className="w-full" key={widget.widget_id.toString()}>
                    <Label className="flex justify-center text-xl">{widget.widget_name}</Label>
                    <Image
                      src={WidgetPreview(widget.widget_id)}
                      alt={widget.widget_name}
                      width={300}
                      height={300}
                      aria-selected={true}
                      className={cn(
                        "h-auto w-auto object-cover aspect-[3/2] hover:cursor-pointer duration-200 rounded-md",
                        theme==='dark'? "hover:border hover:border-white" : "hover:border hover:border-black"
                      )}
                      onClick={()=>{
                        setOpen(false)
                        onAddCallback(widget.widget_id)
                      }}
                    />
                  </div>
                ))
                : <div className="flex"><div className="w-full h-full justify-center items-center text-xl">Oops! no available widget</div></div>
              }
            </div>
            :
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-8 w-[200px]" />
              </div>
            </div>
          }
          <SheetFooter className="pt-10">
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
