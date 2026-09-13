import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  profileService,
  projectService,
  experienceService,
  skillService,
  educationService,
  achievementService,
  messageService
} from '../services/portfolioService';
import {
  initialProfile,
  initialProjects,
  initialExperience,
  initialSkills,
  initialEducation,
  initialAchievements
} from '../services/seedData';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(initialProfile);
  const [projects, setProjects] = useState(initialProjects);
  const [experience, setExperience] = useState(initialExperience);
  const [skills, setSkills] = useState(initialSkills);
  const [education, setEducation] = useState(initialEducation);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = useCallback(async () => {
    try {
      const [
        profileData,
        projectsData,
        experienceData,
        skillsData,
        educationData,
        achievementsData,
        messagesData
      ] = await Promise.allSettled([
        profileService.getProfile(),
        projectService.getAll(),
        experienceService.getAll(),
        skillService.getAll(),
        educationService.getAll(),
        achievementService.getAll(),
        messageService.getAll()
      ]);

      if (profileData.status === 'fulfilled' && profileData.value) {
        setProfile(profileData.value);
      }
      if (projectsData.status === 'fulfilled' && Array.isArray(projectsData.value) && projectsData.value.length > 0) {
        setProjects(projectsData.value);
      }
      if (experienceData.status === 'fulfilled' && Array.isArray(experienceData.value) && experienceData.value.length > 0) {
        setExperience(experienceData.value);
      }
      if (skillsData.status === 'fulfilled' && Array.isArray(skillsData.value) && skillsData.value.length > 0) {
        setSkills(skillsData.value);
      }
      if (educationData.status === 'fulfilled' && Array.isArray(educationData.value) && educationData.value.length > 0) {
        setEducation(educationData.value);
      }
      if (achievementsData.status === 'fulfilled' && Array.isArray(achievementsData.value) && achievementsData.value.length > 0) {
        setAchievements(achievementsData.value);
      }
      if (messagesData.status === 'fulfilled' && Array.isArray(messagesData.value)) {
        setMessages(messagesData.value);
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Listen for custom broadcast events across tabs/windows or local updates
    const handleSync = () => {
      refreshData();
    };

    window.addEventListener('portfolio_data_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('portfolio_data_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [refreshData]);

  // Trigger broadcast whenever an admin page saves an update
  const notifyUpdated = () => {
    refreshData();
    window.dispatchEvent(new Event('portfolio_data_updated'));
  };

  const value = {
    profile,
    projects,
    experience,
    skills,
    education,
    achievements,
    messages,
    loading,
    error,
    refreshData,
    notifyUpdated
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export default PortfolioContext;
