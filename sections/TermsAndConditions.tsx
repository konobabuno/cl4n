import PortableTextRenderer from "@/components/PortableTextRendererTerms";
import AnimateOnView from "@/components/AnimateOnView";
import { PortableTextBlock } from "@portabletext/types";

type TermsAndConditions = {
    headline?: string;
    title?: string;
    content?: PortableTextBlock[];
    backgroundColor?: { value: string };
}

export default function TermsAndConditions(section: TermsAndConditions) {
    const color = section.backgroundColor?.value || '#B70100';  
    let newColor = [];
    if (color){
        for (let i = 0; i < 7; i++) {
            newColor.push(color[i]);
        }
    }
    let newColorString: string = newColor.join('');
    return(
        <section style={{ backgroundColor: newColorString }}>
            <div className="container p-lat relative">
                <div className="extra-layout-top" style={{ backgroundColor: newColorString }}></div>
                <div className="row pt-blue pb-pink justify-center">
                    <AnimateOnView className="w-full md:w-9/12 lg:w-6/12">
                        {section.headline && (
                            <div className="flex justify-center">
                                <div className="detalle circular-tag">
                                    { section.headline }
                                </div>
                            </div>
                        )}
                        {section.title && (
                            <div className="pt-4 md:pt-6">
                                <h2 className="h1 text-center relative">
                                    {section.title}
                                </h2>
                            </div>
                        )}
                        <div className="row justify-center">
                            <div className="w-full lg:w-10/12">
                                {section.content && section.content.length > 0 && (
                                    <div className="pt-blue content-legals">
                                        <PortableTextRenderer value={section.content} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </AnimateOnView>
                </div>
                <div className="extra-layout" style={{ backgroundColor: newColorString }}></div>
            </div>
        </section>
    )

   
    
}