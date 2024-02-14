import { Layout_Widgets } from "@prisma/client";

type WidgetType = {
  widget: Layout_Widgets;
};

export const EmbeddedWidget: React.FC<WidgetType> = ({widget}) => {
  return (
    <iframe className="w-full h-full"
      title="Embedded Content"
      // src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7161726188711849984"
      src={(widget.widget_json as any)?.iframe}
      frameBorder="0"
      allowFullScreen
    ></iframe>
  )
}
