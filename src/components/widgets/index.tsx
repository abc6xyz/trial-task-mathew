import { Layout_Widgets } from "@prisma/client";
import { EmbeddedWidget } from "./embedded";
import EmbeddedWidgetPreview from "./embedded/preview.jpg";
import { EmbeddedWidgetEditForm } from "./embedded/edit";
import { RssReader } from "./rssReader";
import RssReaderPreview from "./rssReader/preview.jpg";
import { RssReaderEditForm } from "./rssReader/edit";
import { z } from "zod";
import { WIDGETS } from "@/const";

type WidgetType = {
  widget: Layout_Widgets;
};

const DashboardWidget: React.FC<WidgetType> = ({widget}) => {
  switch (WIDGETS[widget.widget_id].name) {
    case "Embedded":
      return <EmbeddedWidget iframe={(widget.widget_json as any).iframe}/>
    case "RSS":
      return <RssReader url={(widget.widget_json as any).url}/>
    default:
      return <EmbeddedWidget iframe={(widget.widget_json as any).iframe}/>
  }
}

export const WidgetEditForm: React.FC<WidgetType> = ({widget}) => {
  switch (WIDGETS[widget.widget_id].name) {
    case "Embedded":
      return <EmbeddedWidgetEditForm />
    case "RSS":
      return <RssReaderEditForm />
    default:
      return <EmbeddedWidgetEditForm />
  }
}

export function WidgetPreview(widget_id:number) {
  switch (WIDGETS[widget_id].name) {
    case "Embedded":
      return EmbeddedWidgetPreview
    case "RSS":
      return RssReaderPreview
    default:
      return EmbeddedWidgetPreview
  } 
}

export function EditFormSchema(widget_id:number | undefined) {
  if (widget_id)
  switch (WIDGETS[widget_id].name) {
    case "Embedded":
      return z.object({
        iframe: z.string().min(1)
      })
    case "RSS":
      return z.object({
        url: z.string().min(1)
      })
    default:
      return z.object({
        iframe: z.string().min(1)
      })
  }
  return z.object({
    iframe: z.string().min(1)
  })
}

export function DefaultFormValues(widget_id:number | undefined) {
  if (widget_id)
  switch (WIDGETS[widget_id].name) {
    case "Embedded":
      return {
        iframe: "",
      }
    case "RSS":
      return {
        url: "",
      }
    default:
      return {
        iframe: "",
      }
  }
  return {
    iframe: "",
  }
}

export default DashboardWidget