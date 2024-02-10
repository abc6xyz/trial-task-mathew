import { cn } from "@/lib/utils";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";
import ProfilePicture from "@/components/widgets/profile/snapshot.png"
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { WidgetItem } from "@/validations/widget";

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
] as const

export function WidgetsPreview({widgets}: {widgets: WidgetItem[]}) {
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
          name="items"
          render={() => (
            <FormItem className="space-y-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              { widgets.length?
                widgets.map((item) => (
                  <FormField
                    key={item.widget_id}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.widget_id}
                        >
                          <FormControl>
                            <Image
                              src={ProfilePicture}
                              alt={item.widget_name}
                              width={150}
                              height={150}
                              aria-selected={true}
                              className={cn(
                                "h-auto w-auto object-cover aspect-[3/4] blur-[4px] hover:blur-[0px] hover:cursor-pointer duration-200 rounded-md",
                                field.value?.includes(item.widget_id) ? "blur-[0px]" : ""
                                )}
                              onClick={(e)=>{
                                field.onChange(addOrRemoveFromArray(field.value,item.widget_id))
                              }}
                            />
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
