import { cn } from "@/lib/utils";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Widget } from "@prisma/client";
import { WidgetPreview } from "./widgets";
import { Label } from "@radix-ui/react-label";

export function WidgetsPreview({widgets}: {widgets: Widget[]}) {
  const addOrRemoveFromArray = (arr: number[], element:number) => {
    var index = arr.indexOf(element);
    if (index !== -1) {
      arr.splice(index, 1);
    } else {
      arr.push(element);
    }
    return arr
  }
  return (
    <ScrollArea className="h-[500px] w-full">
      <div className="px-5">
        <FormField
          name="widgets"
          render={() => (
            <FormItem className="space-y-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              { widgets.length?
                widgets.map((widget) => (
                  <FormField
                    key={widget.widget_id}
                    name="widgets"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={widget.widget_id}
                        >
                          <FormControl>
                            <div>
                            <Image
                              src={WidgetPreview(widget.widget_id)}
                              alt={widget.widget_name}
                              width={300}
                              height={300}
                              aria-selected={true}
                              className={cn(
                                "h-auto w-auto object-cover aspect-[3/2] blur-[4px] hover:blur-[0px] hover:cursor-pointer duration-200 rounded-md",
                                field.value?.includes(widget.widget_id) ? "blur-[0px]" : ""
                                )}
                                onClick={(e)=>{
                                  field.onChange(addOrRemoveFromArray(field.value,widget.widget_id))
                                }}
                            />
                            <Label className="flex justify-center">{widget.widget_name}</Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                ))
                : <div className="flex"><div className="w-full h-full justify-center items-center">Oops! no available widget</div></div>
              }
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </ScrollArea>
  )
}
