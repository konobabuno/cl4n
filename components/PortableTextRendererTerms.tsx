import { PortableText, PortableTextProps } from "@portabletext/react";
import AnimateOnView from "./AnimateOnView";

const portableTextComponents: PortableTextProps["components"] = {
  types: {},
  block: {
    normal: ({ children }) => (
      <p className="uppercase pt-4">{children}</p>
    ),
    h3: ({ children }) => (
      <h3 className="h3 uppercase pt-blue">{children}</h3>
    ),
  },
  marks: {},
  list: {},
  listItem: {},
};

const PortableTextRenderer = ({
  value,
}: {
  value: PortableTextProps["value"];
}) => {
  return (
    <AnimateOnView>
      <PortableText value={value} components={portableTextComponents} />
    </AnimateOnView>
  );
};

export default PortableTextRenderer;
