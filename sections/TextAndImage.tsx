import ImageComponent from '@/components/ImageComponent';
import TitleText from "@/components/TitleText";
import LinkComponent from "@/components/LinkComponent";
import AnimateOnView from "@/components/AnimateOnView";
import { PortableTextBlock } from "@portabletext/types";


type TextAndImage= {
    imagePosition?: 'left' | 'right';
    headline?: string;
    title?: PortableTextBlock;
    description?: string;
    image?: Image;
    ctaButton?: Link;
};


export default function  TextAndImage(section: TextAndImage) {

    let left = false;

    if (section.imagePosition) {
        left = section.imagePosition.includes('left');
    }

    return (
        <section>
            <div className="container p-lat">
                <div className={`row ${left ? 'flex-row-reverse' : ''} `}>
                    <div className={`w-1/12 lg:hidden`}></div>
                    <AnimateOnView  className={`md:w-10/12 lg:w-5/12 flex flex-col uppercase  ${left ? 'lg:mx-auto delay-lg' : ''} `}>
                        <div className="flex flex-col gap-6 items-center lg:items-start ">
                            <p className='detalle uppercase text-center lg:text-start'>{section.headline}</p>
                            {section.title && (
                                <h2 className='h1 relative text-center lg:text-start'>
                                    <TitleText text={section.title} />
                                </h2>
                            )}
                           
                        </div>
                        <div className="pt-blue mt-auto">
                            <p className='uppercase'>
                                {section.description}
                            </p>
                        </div>
                        {
                            section.ctaButton && (section.ctaButton.href || section.ctaButton.page )&& section.ctaButton.label &&
                            <div className="pt-red flex justify-center lg:justify-start">
                                    <LinkComponent {...section.ctaButton }>
                                        <div className="btn">
                                            {section.ctaButton.label}
                                        </div>
                                    </LinkComponent>
                            </div>
                        }   
                    </AnimateOnView>
                    <div className={`w-1/12 lg:hidden`}></div>
                    <div className={`w-1/12 lg:hidden`}></div>
                    {
                        section.image && (
                            <AnimateOnView  className={`w-full md:w-10/12 lg:w-6/12 ${left ? 'flex-row-reverse ' : ' mx-auto  lg:mr-0 lg:ml-auto delay-lg'}  pt-blue lg:pt-0!`}>
                                <ImageComponent
                                    image={section.image}
                                    sizes="(max-width: 768px) 100vw, (max-width: 768px) 90vw, 75vw"
                                    optionalAlt="Img Project"
                                    classContainer="rounded-[10px] lg:rounded-[15px]  overflow-hidden"
                                />
                            </AnimateOnView>
                        )
                    }
                    
                    <div className={`w-1/12 lg:hidden`}></div>
                        
                </div>
            </div>
        </section>
    );
}
