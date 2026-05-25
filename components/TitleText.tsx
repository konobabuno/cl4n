import PortableTextRenderer from "./PortableTextRenderer";
import { PortableTextBlock } from "@portabletext/types";
import {stegaClean} from 'next-sanity'

export default function TitleText({ text }: {  text: PortableTextBlock }) {
  return (
    <>
      <div className="opacity-0 absolute left-0 bottom-0 w-full ">
          <PortableTextRenderer value={text} />
      </div>
      <PortableTextRenderer value={stegaClean(text) } />
    </>
  );
}