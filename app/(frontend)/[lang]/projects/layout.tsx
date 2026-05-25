import { fetchSanityServicesLinkedToProjects } from '@/sanity/services/fetchProjects';
import InnerProjectsPage from '@/components/InnerProjectsPage';
import { PageTransitionLoader } from '@/components/PageTransitionLoader';
import { ProjectsTransitionHandler } from '@/components/ProjectsTransitionHandler';



export default async function ProjectsLayout({
    children,
    params,
  }: {
    readonly children: React.ReactNode;
    params: Promise<{ lang: string }>;
  }) {
    const { lang } = await params;
    const servicesLinkedToProjects = await fetchSanityServicesLinkedToProjects(lang as LocalePage);
    
    return (
      <main>
        <PageTransitionLoader/>
        <ProjectsTransitionHandler />
        <section className="pb-pink min-h-screen relative">
              <InnerProjectsPage services={servicesLinkedToProjects}>
                  {children}
              </InnerProjectsPage>
        </section>
      </main>
    );
}