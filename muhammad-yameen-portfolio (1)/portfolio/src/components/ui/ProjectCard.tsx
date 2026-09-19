'use client';

import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import TiltCard from './TiltCard';
import { ProjectDTO } from '@/types';

export default function ProjectCard({ project, index }: { project: ProjectDTO; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
    >
      <TiltCard className="rounded-2xl h-full">
        <div className="relative rounded-2xl overflow-hidden border border-bone/10 bg-ink-900/60 h-full flex flex-col">
          <div className="relative aspect-[16/10] overflow-hidden">
            {project.imageUrl ? (
              <motion.img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.6 }}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center">
                <span className="font-display italic text-bone-faint">{project.title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
          </div>

          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-display italic text-xl text-bone mb-2">{project.title}</h3>
            <p className="text-sm text-bone-dim leading-relaxed mb-4 flex-1">{project.description}</p>

            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-ink-800 border border-bone/10 text-bone-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-bone/10">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="flex items-center gap-2 text-sm text-bronze-light hover:text-bronze transition-colors"
                >
                  <FaExternalLinkAlt className="text-xs" /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="flex items-center gap-2 text-sm text-bone-dim hover:text-bone transition-colors"
                >
                  <FaGithub /> GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
