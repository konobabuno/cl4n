import TitleText from "@/components/TitleText";
import { PortableTextBlock } from "@portabletext/types";
import SliderProjects from "@/components/SliderProjects";
import AnimateOnView from '@/components/AnimateOnView';

type FeaturedProjects = {
    backgroundColor?: {
        value: string;
    };
    headline?: string;
    title?: PortableTextBlock;
    projects: ProjectPost[];
}

export default function  FeaturedProjects(section: FeaturedProjects) {
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
            <div className="container p-lat overflow-hidden" style={{ backgroundColor: newColorString}}> 
                <div className="row justify-center items-center pt-green pb-green">
                    <AnimateOnView className="w-full lg:w-10/12 flex flex-col items-center">
                        {section.headline && (
                            <div className="detalle circular-tag animate uppercase">
                                {section.headline}
                            </div>
                        )}
                        {section.title && (
                            <div className="h1 text-center pt-6 relative animate">
                                <TitleText text={section.title} />
                            </div> 
                        )}
                    </AnimateOnView>
                    <AnimateOnView className="w-full delay-sm">
                        <SliderProjects projects={section.projects} color={newColorString}/>
                    </AnimateOnView>
                </div>
                <div className="extra-layout" style={{ backgroundColor: newColorString}}>
                </div>
            </div>
        </section>
    );
}
