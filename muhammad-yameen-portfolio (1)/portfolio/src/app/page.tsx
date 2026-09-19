import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import VideoGallery from '@/components/sections/VideoGallery';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import SoftwareDev from '@/components/sections/SoftwareDev';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import { VideoDTO, ProjectDTO, SkillDTO, SocialLinkDTO } from '@/types';

export const dynamic = 'force-dynamic';

const VIDEO_PAGE_SIZE = 6;

async function getData() {
  const [settings, videos, projects, skills, social] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.video.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      take: VIDEO_PAGE_SIZE,
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.skill.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
    prisma.socialLink.findMany(),
  ]);

  return { settings, videos, projects, skills, social };
}

export default async function Home() {
  const { settings, videos, projects, skills, social } = await getData();

  const videoDTOs: VideoDTO[] = videos.map((v: (typeof videos)[number]) => ({
    ...v,
    date: v.date.toISOString(),
  }));

  const projectDTOs: ProjectDTO[] = projects;
  const skillDTOs: SkillDTO[] = skills;
  const socialDTOs: SocialLinkDTO[] = social as SocialLinkDTO[];

  const nextCursor = videos.length === VIDEO_PAGE_SIZE ? videos[videos.length - 1].id : null;

  return (
    <>
      <Navbar name={settings.name} logoUrl={settings.logoUrl} />

      <main>
        <Hero
          name={settings.name}
          tagline={settings.heroTagline}
          description={settings.heroDescription}
        />

        <VideoGallery
          initialVideos={videoDTOs}
          initialNextCursor={nextCursor}
          title={settings.videosSectionTitle}
        />

        <About
          heading={settings.aboutHeading}
          body={settings.aboutBody}
          profileImageUrl={settings.profileImageUrl}
          age={settings.age}
        />

        <Skills skills={skillDTOs} title={settings.skillsSectionTitle} />

        <SoftwareDev />

        <Projects projects={projectDTOs} title={settings.projectsSectionTitle} />

        <Contact email={settings.email} phone={settings.phone} social={socialDTOs} />
      </main>

      <Footer name={settings.name} social={socialDTOs} />
    </>
  );
}
