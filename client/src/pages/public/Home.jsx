import Navbar from '../../components/public/Navbar';
import HeroSection from '../../components/public/HeroSection';
import WorkSection from '../../components/public/WorkSection';
import SkillsSection from '../../components/public/SkillsSection';
import AboutSection from '../../components/public/AboutSection';
import ExperienceSection from '../../components/public/ExperienceSection';
import ContactSection from '../../components/public/ContactSection';
import Footer from '../../components/public/Footer';

export default function Home() {
  return (
    <div className="home-page">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Selected Work Section */}
        <WorkSection />

        {/* Technical Skills Section */}
        <SkillsSection />

        {/* About & Education Section */}
        <AboutSection />

        {/* Work Experience Section */}
        <ExperienceSection />

        {/* Contact Details Section (No Form) */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
