import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { ProjectDTO } from '@/types';

export default function Projects({ projects, title }: { projects: ProjectDTO[]; title: string }) {
  return (
    <section id="projects" className="relative py-28 md:py-36 bg-ink-900/40">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading index="04" label="Engineering" title={title} />

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-bone/15 py-24 text-center">
            <p className="font-display italic text-2xl text-bone-dim">
              New projects are coming soon.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
