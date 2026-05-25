import TitleText from "@/components/TitleText";
import LinkComponent from "@/components/LinkComponent";
import AnimateOnView from "@/components/AnimateOnView";

type ServicesDescription = {
    headline?: string;
    title?: any;
    services?: {
        _key: string;
        name: string;
        description: string;
        service: { title: string; language: string }
    }[];
}
                

export default function ServicesDescription(section: ServicesDescription) {
    return (
        <section>
            <div className="container p-lat">
                <div className="row justify-center lg:justify-start">
                    <AnimateOnView  className="w-full md:w-10/12 lg:w-6/12 text-center lg:text-start">
                        <div className="detalle uppercase animate">
                            {section.headline}
                        </div>
                        <div className="pt-6 animate">
                            {section.title && (
                                <div className="h1">
                                    <TitleText text={section.title} />
                                </div> 
                            )}
                        </div>
                    </AnimateOnView>
                </div>
                <AnimateOnView  className="row pt-blue gap-y-4">
                    {section.services && section.services.map((service, index) => (
                        <LinkComponent 
                        key={service._key}
                        linkType="page" 
                        page={
                            {_type: 'service', slug: service.service.title, language: service.service.language}
                        }  
                        className="w-full md:w-6/12 lg:w-4/12 h-80 md:h-[282px] lg:h-[332px]">
                            <div className="p-8 lg:p-12 h-full flex flex-col border circular-border rounded-[15px]">
                                <div className="flex items-center justify-between">
                                    <div className="h3 uppercase">
                                        {service.name}
                                    </div>
                                    <div className="w-12 h-12 md:w-[42px] md:h-[42px] flex items-center justify-center bg-offwhite rounded-[5px]">
                                        <svg className="w-4 md:w-[14px] h-auto" width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.293 9.41379L14.7071 7.99972L13.293 6.58565L11.879 7.99972L13.293 9.41379ZM13.293 12.2426L14.7071 10.8285L13.293 9.41379L11.8783 10.8285L13.293 12.2426ZM13.293 15.0714L14.7074 13.657L13.293 12.2426L11.879 13.6573L13.293 15.0714ZM6.22267 2.34343L7.63674 3.7575L9.05081 2.34343L7.63642 0.929039L6.22267 2.34343ZM3.39357 2.34311L4.80828 3.75782L6.22267 2.34343L4.80764 0.929039L3.39357 2.34311ZM0.565104 2.34343L1.97918 3.7575L3.39357 2.34311L1.97949 0.929039L0.565104 2.34343Z" fill="black"/>
                                            <path d="M11.878 5.17129L13.293 6.58565L14.7068 5.17129L13.2927 3.75722L14.7071 2.34283L13.2927 0.928436L11.8786 2.34251L10.4645 0.928436L9.04984 2.34314L10.4639 3.75722L0.564453 13.6567L1.97884 15.0711L11.878 5.17129Z" fill="black"/>
                                        </svg>
                                    </div>
                                </div>
                                
                                <div className="uppercase mt-auto">
                                    {service.description}
                                </div>
                            </div>
                        </LinkComponent>
                    ))}
                </AnimateOnView>
            </div>
        </section>
    );
}