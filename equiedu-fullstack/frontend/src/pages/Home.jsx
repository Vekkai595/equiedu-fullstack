import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ProblemSection from '@/components/home/ProblemSection';
import ODSSection from '@/components/home/ODSSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProblemSection />
      <ODSSection />
    </div>
  );
}