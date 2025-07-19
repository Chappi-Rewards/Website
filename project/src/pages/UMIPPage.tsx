import React, { useState } from 'react';
import { UMIPDashboard } from '../components/UMIP/UMIPDashboard';
import { MissionBuilder } from '../components/UMIP/MissionBuilder';
import { AnalyticsDashboard } from '../components/UMIP/AnalyticsDashboard';
import { IntegrationHub } from '../components/UMIP/IntegrationHub';
import { PricingBilling } from '../components/UMIP/PricingBilling';

export const UMIPPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'dashboard' | 'missions' | 'analytics' | 'integrations' | 'billing'>('dashboard');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <UMIPDashboard />;
      case 'missions':
        return <MissionBuilder />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'integrations':
        return <IntegrationHub />;
      case 'billing':
        return <PricingBilling />;
      default:
        return <UMIPDashboard />;
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      {renderActiveModule()}
    </div>
  );
};