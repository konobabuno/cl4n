import { fetchSanityServices } from '@/sanity/services/fetchProjects';
import { PageTransitionLoader } from '@/components/PageTransitionLoader';
import ServicesLinks from '@/components/servicesLinks';

export default async function ProjectsLayout({
    children,
    params,
  }: {
    readonly children: React.ReactNode;
    params: Promise<{ lang: string }>;
  }) {
    const { lang } = await params;
    const services = await fetchSanityServices(lang as LocalePage);
    
    return (
      <main>
        <PageTransitionLoader/>
        <section className="mt-0! pt-[117px] md:pt-[146px] lg:pt-[141px]">
          <div className="container p-lat">
            <div className="row justify-center">
              <div className="col-lg-6">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <ServicesLinks services={services} lang={lang as LocalePage} />
                </div>
              </div>
            </div>
          </div>
        </section>
        {children}
      </main>
    );
}