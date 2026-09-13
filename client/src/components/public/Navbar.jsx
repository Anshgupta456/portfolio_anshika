import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Code2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('work');
  const { profile } = usePortfolio();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = useMemo(() => [
    { id: 'about', label: 'About', href: isHomePage ? '#about' : '/#about' },
    { id: 'education', label: 'Education', href: isHomePage ? '#education' : '/#education' },
    { id: 'work', label: 'Work', href: isHomePage ? '#work' : '/#work' },
    { id: 'skills', label: 'Skills', href: isHomePage ? '#skills' : '/#skills' },
    { id: 'experience', label: 'Experience', href: isHomePage ? '#experience' : '/#experience' },
    { id: 'contact', label: 'Contact', href: isHomePage ? '#contact' : '/#contact' },
  ], [isHomePage]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-20">

          {/* Logo / Brand & Status */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group/brand">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-mono font-bold text-xs tracking-wider group-hover/brand:bg-[#367C8E] transition-colors shadow-xs">
                &lt;/&gt;
              </div>
              <span className="font-display font-bold text-base tracking-tight text-zinc-950 group-hover/brand:text-[#367C8E] transition-colors">
                {profile?.name || 'Anshika Gupta'}
              </span>
            </Link>

            <div className="group/status hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white shadow-xs hover:border-[#B2D8E2] transition-all">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 group-hover/status:bg-[#367C8E] group-hover/status:ring-[#367C8E]/25 transition-all duration-300"></span>
              <span className="text-[11px] font-medium text-zinc-800 tracking-tight">Available for full-time opportunities</span>
            </div>
          </div>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="group/link inline-flex items-center text-sm font-medium transition-colors"
                onClick={() => setActiveTab(link.id)}
              >
                <span className={`transition-colors ${activeTab === link.id ? 'text-zinc-950 font-semibold' : 'text-zinc-800 group-hover/link:text-[#367C8E]'}`}>
                  {link.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-3.5">
            <a
              href={isHomePage ? '#contact' : '/#contact'}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-[#367C8E] transition-all duration-300 group/btn"
            >
              <span>Let's Talk</span>
              <ArrowUpRight size={15} strokeWidth={2.4} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>

            {/* Mobile Toggle */}
            <button
              type="button"
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg border border-zinc-200 bg-white text-zinc-900"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="flex md:hidden flex-col gap-4 bg-white border-b border-zinc-200 px-6 py-5">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-zinc-200 w-fit bg-zinc-50">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-zinc-700">Available for New Opportunities</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="flex justify-between items-center py-2 text-base font-medium text-zinc-800 border-b border-zinc-100"
                onClick={() => {
                  setActiveTab(link.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <a
            href={isHomePage ? '#contact' : '/#contact'}
            className="flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-[#367C8E]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={16} strokeWidth={2.4} />
          </a>
        </div>
      )}
    </header>
  );
}
