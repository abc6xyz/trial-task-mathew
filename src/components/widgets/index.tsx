import { Layout_Widgets } from "@prisma/client";
import { EmbeddedWidget } from "./embedded";
import EmbeddedWidgetPreview from "./embedded/preview.jpg";
import { EmbeddedWidgetEditForm } from "./embedded/edit";
import { z } from "zod";

type WidgetType = {
  widget: Layout_Widgets;
};

const DashboardWidget: React.FC<WidgetType> = ({widget}) => {
  return (
    <>
    { widget.widget_id === 1 && 
      <EmbeddedWidget widget={widget}/>
    }
    </>
  );
}

export const WidgetEditForm: React.FC<WidgetType> = ({widget}) => {
  return (
    <>
    { widget.widget_id === 1 && 
      <EmbeddedWidgetEditForm />
    }
    </>
  );
}

export function WidgetPreview(widget_id:number) {
  switch (widget_id) {
    case 1:
      return EmbeddedWidgetPreview
    default:
      return EmbeddedWidgetPreview
  } 
}

export function EditFormSchema(widget_id:number) {
  switch (widget_id) {
    case 1:
      return z.object({
        iframe: z.string().min(1)
      })
    default:
      return z.object({
        iframe: z.string().min(1)
      })
  }
}

export function DefaultFormValues(widget_id:number) {
  switch (widget_id) {
    case 1:
      return {
        iframe: "",
      }
    default:
      return {
        iframe: "",
      }
  }
}

export default DashboardWidget