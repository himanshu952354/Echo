import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import HeroSection from './components/Landing/HeroSection';
import FeaturesSection from './components/Landing/FeaturesSection';
import CTASection from './components/Landing/CTASection';
import LandingFooter from './components/Landing/LandingFooter';

const LandingPage = ({ onGetStarted }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white overflow-hidden pt-16 selection:bg-purple-500/30">
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <CTASection onGetStarted={onGetStarted} />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
