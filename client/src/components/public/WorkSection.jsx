import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ProjectCard from './ProjectCard';
import { usePortfolio } from '../../context/PortfolioContext';

export default function WorkSection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { projects } = usePortfolio();

  const formattedProjects = useMemo(() => {
    return (projects || []).map((p, idx) => ({
      id: p.id || p._id,
      number: String(idx + 1).padStart(2, '0'),
      title: p.title,
      duration: Array.isArray(p.techStack) && p.techStack.length > 0 ? p.techStack.slice(0, 2).join(' · ') : 'Full Stack',
      theme: idx % 2 === 0 ? 'dark' : 'light',
      category: p.featured ? 'Featured' : 'Full Stack',
      tags: Array.isArray(p.techStack) ? p.techStack : [],
      verticalBadge: p.featured ? 'Featured' : 'Production',
      imageUrl: p.imageUrl,
      liveLink: p.liveLink,
      githubLink: p.githubLink,
      description: p.description
    }));
  }, [projects]);

  const filterTabs = ['All', 'Featured', 'Full Stack'];

  const filteredProjects = activeFilter === 'All'
    ? formattedProjects
    : formattedProjects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="relative py-12 sm:py-16 pb-20 bg-white overflow-hidden scroll-mt-20">
      {/* Invisible anchor for backward compatibility */}
      <span id="work" className="sr-only" aria-hidden="true" />

      {/* Background shirt-matching teal ambient glow (colored by default) */}
      <div
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.35)_0%,rgba(232,244,247,0.18)_50%,transparent_85%)] blur-[75px] pointer-events-none opacity-80 z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">

        {/* Section Header with Faint Background Watermark */}
        <SectionHeading
          watermark="PROJECTS"
          title="FEATURED PROJECTS"
          variant="color"
          align="center"
          className="mb-6"
        />

        {/* Filter Tabs & View All Action Row */}
        <div className="relative z-10 flex flex-wrap justify-between items-center mb-6 gap-4">

          {/* Filter Categories */}
          <div className="flex items-center gap-6">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`text-sm transition-colors py-1 cursor-pointer ${activeFilter === tab
                    ? 'text-[#367C8E] font-bold border-b-2 border-[#367C8E]'
                    : 'text-zinc-500 font-medium hover:text-[#367C8E]'
                  }`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* View All Work Pill CTA */}
          <Link
            to="/projects"
            className="group/all inline-flex items-center gap-2 rounded-full border border-[#367C8E] bg-[#E8F4F7]/40 px-5 py-2 text-xs sm:text-sm font-semibold text-[#367C8E] shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#367C8E] hover:text-white hover:shadow-md hover:shadow-[#367C8E]/20"
          >
            <span>View All Work</span>
            <ArrowUpRight size={15} strokeWidth={2.4} className="transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5" />
          </Link>

        </div>

        {/* 3-Column Projects Grid (Matching Reference Screenshot 01, 02, 03) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}
