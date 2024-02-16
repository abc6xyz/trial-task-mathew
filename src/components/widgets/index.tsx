import { Layout_Widgets } from "@prisma/client";
import { EmbeddedWidget } from "./embedded";
import EmbeddedWidgetPreview from "./embedded/preview.jpg";
import { EmbeddedWidgetEditForm } from "./embedded/edit";
import { RssReader } from "./rssReader";
import RssReaderPreview from "./rssReader/preview.jpg";
import { RssReaderEditForm } from "./rssReader/edit";
import { CryptoChartWidget } from "./cryptochart";
import CryptoChartPreview from "./cryptochart/preview.png"
import { CryptoChartEditForm } from "./cryptochart/edit";
import { CryptoTrakerWidget } from "./cryptotracker";
import CryptoTrackerPreview from "./cryptotracker/preview.png";
import { CryptoPotfolioWidget } from "./cryptoportfolio";
import CryptoPotfolioPreview from './cryptoportfolio/preview.png';
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
    case "CryptoChart":
      return <CryptoChartWidget coinId={(widget.widget_json as any).coin}/>
    case "CryptoTracker":
      return <CryptoTrakerWidget />
    case "CryptoPortfolio":
      return <CryptoPotfolioWidget />
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
    case "CryptoChart":
      return <CryptoChartEditForm />
    default:
      return <EmbeddedWidgetEditForm />
  }
}

export function WidgetPreview(widget_id:number | undefined) {
  if (widget_id)
  switch (WIDGETS[widget_id].name) {
    case "Embedded":
      return EmbeddedWidgetPreview
    case "RSS":
      return RssReaderPreview
    case "CryptoChart":
      return CryptoChartPreview
    case "CryptoTracker":
      return CryptoTrackerPreview
    case "CryptoPortfolio":
      return CryptoPotfolioPreview
    default:
      return EmbeddedWidgetPreview
  }
  return EmbeddedWidgetPreview
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
    case "CryptoChart":
      return z.object({
        coin: z.string().min(1)
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
    case "CryptoChart":
      return {
        coin: "",
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