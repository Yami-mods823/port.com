import SectionHeading from '@/components/ui/SectionHeading';
import SkillBar from '@/components/ui/SkillBar';
import { SkillDTO } from '@/types';

export default function Skills({ skills, title }: { skills: SkillDTO[]; title: string }) {
  if (skills.length === 0) return null;

  return (
    <section id="skills" className="relative py-28 md:py-36 bg-ink-900/40">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <SectionHeading index="03" label="Craft" title={title} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {skills.map((skill, i) => (
            <SkillBar key={skill.id} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
