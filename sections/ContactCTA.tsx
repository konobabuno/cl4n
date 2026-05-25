
import Marquee from "@/components/Marquee";
import TitleText from "@/components/TitleText";
import AnimatedOnView from "@/components/AnimateOnView";
import LinkComponent from "@/components/LinkComponent";
import { PortableTextBlock } from "next-sanity";


type ContactCTA = {
    _key: string;
    _type: string;
    backgroundColor?: Color;
    headline?: string;
    bigText?: PortableTextBlock;
    ctaButton?: Link;
}

export default function  ContactCTA(section: ContactCTA) {
    const color = section.backgroundColor?.value || '#B70100';  
    let newColor = [];
    if (color){
        for (let i = 0; i < 7; i++) {
            newColor.push(color[i]);
        }
    }
    let newColorString: string = newColor.join('');

    return (
        <section>
            <Marquee color={newColorString}/>
            <div className="container p-lat h-screen md:min-h-240 md:h-[50vh] lg:h-screen" style={{ backgroundColor: newColorString}}> 
                <div className="row h-full  justify-center items-center">
                    <AnimatedOnView className="w-full lg:w-10/12 flex flex-col items-center">
                        {section.headline && (
                            <div className="detalle circular-tag uppercase animate ">
                                {section.headline}
                            </div>
                        )}
                        {section.bigText && (
                            <div className="h1 text-center pt-6 relative animate delay-sm">
                                <TitleText text={section.bigText} />
                            </div> 
                        )}
                        {section.ctaButton && (
                            <div className="flex pt-red animate delay-sm-2">
                                <LinkComponent {...section.ctaButton} className="bg-offwhite py-[8px] px-6 lg:px-8 lg:py-4 flex gap-4 items-center rounded-[5px] lg:rounded-[10px] btn-hover">
                                    <span className="dot" style={{ backgroundColor: newColorString}}></span>
                                    <p className="uppercase" style={{ color: newColorString}} >{section.ctaButton.label}</p>
                                </LinkComponent>
                            </div>
                        )}
                    </AnimatedOnView>
                </div>
                <div className="extra-layout" style={{ backgroundColor: newColorString}}>
                </div>
            </div>
        </section>
    );
}
