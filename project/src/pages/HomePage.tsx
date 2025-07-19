import React from 'react';
import { Hero } from '../components/Hero';
import { ChappiWay } from '../components/ChappiWay';
import { AfricaNetworkSection } from '../components/AfricaNetworkSection';
import { ToggleSection } from '../components/ToggleSection';
import { CultureSection } from '../components/CultureSection';
import { CallToAction } from '../components/CallToAction';

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <ChappiWay />
      <AfricaNetworkSection />
      <ToggleSection />
      <CultureSection />
      <CallToAction />
    </>
  );
};