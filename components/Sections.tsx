import TextAndImage from "@/sections/TextAndImage";
import OurClients from "@/sections/OurClients";
import ServicesCTA from "@/sections/ServicesCTA";
import ContactCTA from "@/sections/ContactCTA";
import GeneralHero from "@/sections/GeneralHero";
import AboutUs from "@/sections/AboutUs";
import OurTeam from "@/sections/OurTeam";
import ContactUs from "@/sections/ContactUs";
import TermsAndConditions from "@/sections/TermsAndConditions";
import FeaturedProjects from "@/sections/FeaturedProjects";
import ServicesDescription from "@/sections/ServicesDescription";
import HomeHero from "@/sections/HomeHero";

const componentMap: { [key: string]: React.ComponentType<any> } = {
  "homeHero": HomeHero,
  "textAndImage": TextAndImage,
  "ourClients": OurClients,
  "servicesCTA": ServicesCTA,
  "contactCTA": ContactCTA,
  "generalHero": GeneralHero,
  "aboutUs": AboutUs,
  "ourTeam": OurTeam,
  "contactUs": ContactUs,
  "termsAndConditions": TermsAndConditions,
  "featuredProjects": FeaturedProjects,
  "servicesDescription": ServicesDescription,
}; 

export default function Sections({ sections }: { sections?: Section[] }) {
  
  if (!sections || sections.length === 0) {
    return <p>No section included in this page</p>;
  }
  return (
    <>
      {sections.map((section: Section) => {
        const Component = componentMap[section._type];
        if (!Component) {
          return (
            <div data-type={section._type} key={section._key}>
              Unknown section type: {section._type}
            </div>
          );
        }
        return <Component {...section} key={section._key}  />;
      })}
    </>
  );
}
