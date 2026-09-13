import { useState, useMemo } from 'react';
import { Briefcase, Calendar, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { usePortfolio } from '../../context/PortfolioContext';

export default function ExperienceSection() {
  const [hoveredId, setHoveredId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const { experience: dbExperiences } = usePortfolio();

  const experiences = useMemo(() => {
    if (!Array.isArray(dbExperiences) || dbExperiences.length === 0) {
      return [];
    }
    return dbExperiences.map((exp, idx) => ({
      id: exp.id || exp._id,
      number: String(idx + 1).padStart(2, '0'),
      role: exp.role,
      company: exp.company,
      type: exp.isCurrent ? 'Full-time / Current' : 'Software Engineering',
      duration: [exp.startDate, exp.endDate || (exp.isCurrent ? 'Present' : '')].filter(Boolean).join(' — '),
      location: exp.location || 'India',
      summary: exp.bulletPoints?.[0] || 'Full-stack software engineering and scalable systems development.',
      bullets: Array.isArray(exp.bulletPoints) ? exp.bulletPoints : [],
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Cloud']
    }));
  }, [dbExperiences]);

  return (
    <section id="experience" className="group/exp relative py-16 sm:py-24 bg-[#FAFAFA] overflow-hidden transition-colors duration-700 select-none">
      
      {/* Background shirt-matching teal ambient glow */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(178,216,226,0.35)_0%,rgba(232,244,247,0.18)_50%,transparent_85%)] blur-[90px] pointer-events-none opacity-0 scale-90 transition-all duration-700 group-hover/exp:opacity-100 group-hover/exp:scale-100 z-0" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Section Heading with Expand/Collapse toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div className="flex-1">
            <SectionHeading
              watermark="EXPERIENCE"
              title="WORK EXPERIENCE"
              variant="color"
              align="left"
              className="!mb-0"
            />
          </div>

          {/* Quick Toggle pill: Expand all details / Collapse */}
          <button
            type="button"
            onClick={() => setExpandAll(!expandAll)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-xs font-medium text-zinc-700 shadow-xs transition-all duration-500 group-hover/exp:border-[#367C8E] group-hover/exp:text-[#367C8E] group-hover/exp:shadow-sm cursor-pointer w-fit self-start sm:self-center"
          >
            <Sparkles size={13} className={`transition-colors duration-500 ${expandAll ? 'text-[#367C8E]' : 'text-zinc-400 group-hover/exp:text-[#367C8E]'}`} />
            <span>{expandAll ? 'Collapse Details' : 'Expand All Details'}</span>
          </button>
        </div>

        {/* 
          Compact Timeline Container:
          All 3 experiences fit in one screen view at first glance!
          Hovering over any card smoothly expands its full details.
        */}
        <div className="relative">
          
          {/* Continuous Vertical Timeline Spine */}
          <div 
            className="absolute top-6 bottom-6 left-5 sm:left-6 w-[2px] bg-gradient-to-b from-zinc-300 via-zinc-200 to-transparent z-0 transition-colors duration-500 group-hover/exp:from-[#367C8E]/40 group-hover/exp:via-[#B2D8E2]/50"
            aria-hidden="true"
          />

          {/* Timeline Stack */}
          <div className="space-y-4 sm:space-y-5">
            {experiences.map((exp) => {
              const isCurrent = exp.duration.includes('Present');
              const isExpanded = expandAll || hoveredId === exp.id;

              return (
                <div 
                  key={exp.id} 
                  onMouseEnter={() => setHoveredId(exp.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group/item relative flex items-start gap-4 sm:gap-6 cursor-pointer"
                >
                  
                  {/* Timeline Node on Spine */}
                  <div className="relative z-10 shrink-0 mt-4">
                    <div 
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isExpanded || isCurrent
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-md group-hover/exp:bg-[#367C8E] group-hover/exp:border-[#367C8E] group-hover/exp:shadow-[#367C8E]/30'
                          : 'bg-white text-zinc-600 border-zinc-300 group-hover/exp:border-[#367C8E] group-hover/exp:text-[#367C8E] group-hover/item:bg-[#367C8E] group-hover/item:text-white'
                      }`}
                    >
                      <Briefcase size={16} strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Compact Card Container */}
                  <div 
                    className={`flex-1 rounded-2xl sm:rounded-3xl border transition-all duration-500 p-5 sm:p-6 ${
                      isExpanded
                        ? 'bg-white border-[#367C8E]/50 shadow-xl shadow-zinc-200/50 -translate-y-0.5'
                        : 'bg-white/90 border-zinc-200/90 shadow-xs group-hover/exp:border-[#367C8E]/40 hover:bg-white hover:border-[#367C8E]/60 hover:shadow-md'
                    }`}
                  >
                    
                    {/* Collapsed Top Bar (Always Visible at First Glance) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      
                      {/* Left: Number, Role, Company, Type */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md transition-colors duration-500 group-hover/exp:text-[#367C8E] group-hover/exp:bg-[#E8F4F7]">
                          {exp.number}
                        </span>

                        <h3 className="font-display text-base sm:text-lg font-bold text-zinc-950 tracking-tight">
                          {exp.role}
                        </h3>

                        <span className="text-sm font-semibold text-zinc-700 transition-colors duration-500 group-hover/exp:text-[#367C8E]">
                          @{exp.company}
                        </span>

                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/70 transition-colors duration-500 group-hover/exp:border-[#B2D8E2]">
                          {exp.type}
                        </span>
                      </div>

                      {/* Right: Duration Pill & Expand Hint */}
                      <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-800 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full transition-colors duration-500 group-hover/exp:border-[#B2D8E2] group-hover/exp:bg-[#E8F4F7]/40">
                          <Calendar size={11} className="text-zinc-400 transition-colors duration-500 group-hover/exp:text-[#367C8E]" />
                          <span>{exp.duration}</span>
                        </div>

                        <div className={`text-zinc-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#367C8E]' : 'group-hover/exp:text-[#367C8E]'}`}>
                          <ChevronDown size={16} />
                        </div>
                      </div>

                    </div>

                    {/* Brief Summary (Always visible, single line) */}
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-1">
                      {exp.summary}
                    </p>

                    {/* 
                      Expanded Details Drawer:
                      Smoothly reveals the bullet points and tech pills on hover!
                    */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        isExpanded ? 'max-h-[380px] opacity-100 mt-4 pt-4 border-t border-zinc-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {/* Bullet points */}
                      <ul className="space-y-2 mb-4">
                        {exp.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs text-zinc-700 leading-relaxed">
                            <span className="text-zinc-400 font-bold text-sm leading-none mt-0.5 shrink-0 transition-colors duration-500 group-hover/exp:text-[#367C8E]">
                              •
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-100">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center text-[10px] sm:text-[11px] font-medium text-zinc-700 bg-zinc-50 border border-zinc-200/70 px-2 py-0.5 rounded-md transition-all duration-500 group-hover/exp:border-[#B2D8E2] group-hover/exp:bg-[#E8F4F7]/40 group-hover/exp:text-[#367C8E]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
