import TitleText from "@/components/TitleText"
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import AnimateOnView from "@/components/AnimateOnView";
import { PortableTextBlock } from "@portabletext/types";

type AboutUs = {
    headline: string;
    title: PortableTextBlock;
    values: {
        title: string;
        description: string;
        icon: Image;
    }[];
}

export default function AboutUs(section: AboutUs) {
    return (
        <section>
            <div className="container p-lat ">
                <div className="row justify-center lg:justify-start">
                    <AnimateOnView  className="w-full md:w-10/12 lg:w-6/12 flex flex-col gap-6 items-center lg:items-start text-center lg:text-start">
                        <p className="detalle uppercase ">{section.headline}</p>
                        <h2 className="h1 position-relative  delay-sm">
                            <TitleText text={section.title} />
                        </h2>
                    </AnimateOnView>
                </div>
                <AnimateOnView className="row pt-blue gap-y-4"  >
                    {section.values &&
                        section.values.length > 0 &&
                        section.values.map((value, index) => (
                            <div className="w-full lg:w-4/12 animate" key={index} style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="border border-offwhite rounded-[15px] py-8 lg:py-12 flex flex-col items-start h-full">
                                    <div className="row">
                                        <div className="w-full md:w-3/12 lg:w-full">
                                            <div className="flex items-center md:justify-center lg:justify-start px-8 lg:px-12 h-full">
                                                <div className="w-[64px]">
                                                    <Image
                                                        src={urlFor(value.icon).url()}
                                                        alt={value.icon.alt || "Icon"}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-auto"
                                                        loading="lazy"
                                                        quality={90}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-9/12 lg:w-full">
                                            <div className="px-8 md:pl-0 md:pr-12 lg:px-12">
                                                <h3 className="h3 pt-16 md:pt-0 lg:pt-32">{value.title}</h3>
                                                <p className="pt-4 uppercase">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </AnimateOnView>
            </div>
        </section>
    );
}