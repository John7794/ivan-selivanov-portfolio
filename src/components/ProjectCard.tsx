import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Box, BookOpen, Layers } from 'lucide-react';
import { Project, Language } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
  language: Language;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  language,
  onSelect
}) => {
  const getCategoryIcon = () => {
    switch (project.category) {
      case '3d-render':
        return <Box className="w-3.5 h-3.5 text-cyan-400" />;
      case 'book-design':
        return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
      case 'ui-ux':
        return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(project)}
      className={`group cursor-pointer flex flex-col ${index % 2 !== 0 ? 'md:mt-24' : ''}`}
    >
      {/* Visual Container */}
      <div className="aspect-[4/5] bg-neutral-900 mb-6 overflow-hidden relative border border-neutral-800/80">
        {/* Format & Status Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
          <span className="bg-black/90 backdrop-blur-md text-white px-2.5 py-1 text-[11px] uppercase tracking-wider font-mono border border-neutral-700 flex items-center gap-1.5 shadow-md">
            {getCategoryIcon()}
            <span>{project.categoryLabel[language]}</span>
          </span>

          <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-mono border shadow-md ${
            project.status === 'realized'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80'
              : 'bg-neutral-900/90 text-neutral-400 border-neutral-700'
          }`}>
            {project.status === 'realized' ? (language === 'ua' ? 'Реалізовано' : 'Production') : (language === 'ua' ? 'Концепт' : 'Concept')}
          </span>
        </div>

        {/* Hover inspect hint */}
        <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/90 px-3 py-1 text-[11px] font-mono text-white border border-neutral-600 flex items-center gap-1.5">
          <span>{language === 'ua' ? 'ВІДКРИТИ КЕЙС' : 'VIEW CASE STUDY'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>

        {/* Image with zoom and contrast */}
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover grayscale opacity-80 transform group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-[0.16,1,0.3,1]"
        />
      </div>

      {/* Content Meta */}
      <div className="flex justify-between items-start pt-1">
        <div className="pr-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs text-neutral-500">
              0{index + 1} //
            </span>
            <span className="font-mono text-xs text-neutral-500 uppercase">
              {project.timeline}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-medium uppercase tracking-tight text-neutral-100 group-hover:text-white group-hover:underline underline-offset-4 transition-colors">
            {project.title}
          </h3>
          <p className="text-neutral-400 text-sm font-light mt-1 max-w-md line-clamp-2">
            {project.tagline[language]}
          </p>
        </div>

        <div className="w-10 h-10 shrink-0 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
          <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
