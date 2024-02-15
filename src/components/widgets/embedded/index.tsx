type EmbeddedWidgetProps = {
  iframe: string | null;
};

export const EmbeddedWidget: React.FC<EmbeddedWidgetProps> = ({iframe}) => {
  return (
    iframe ?
    <iframe className="w-full h-full"
      title="Embedded Content"
      // src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7161726188711849984"
      src={iframe}
      frameBorder="0"
      allowFullScreen
    ></iframe>
    :
    <></>
  )
}
