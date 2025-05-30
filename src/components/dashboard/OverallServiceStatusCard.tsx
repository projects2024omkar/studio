
'use client';

import React from 'react';
import { CheckCircle2, XCircle, Wifi, Loader2 } from 'lucide-react';
import CardWrapper from '@/components/shared/CardWrapper';
import { useDataFetching } from '@/hooks/useDataFetching';
import type { MarketSnapshot, AIPrediction, StrategyRecommendation, PortfolioRisk, OptionsGreeks, TechnicalIndicators } from '@/types/api';

const ServiceStatusItem: React.FC<{ name: string; isOnline: boolean; isLoading: boolean }> = ({ name, isOnline, isLoading }) => {
  let Icon = Loader2;
  let color = 'text-muted-foreground';
  let statusText = 'Loading...';

  if (!isLoading) {
    if (isOnline) {
      Icon = CheckCircle2;
      color = 'text-green-500'; // Use Tailwind classes from theme
      statusText = 'Online';
    } else {
      Icon = XCircle;
      color = 'text-red-500'; // Use Tailwind classes from theme
      statusText = 'Offline';
    }
  }

  return (
    <div className="flex items-center justify-between py-1.5 px-2 even:bg-muted/30 rounded-md">
      <span className="text-sm">{name}</span>
      <div className={`flex items-center space-x-1 text-xs ${color}`}>
        <Icon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{statusText}</span>
      </div>
    </div>
  );
};

const OverallServiceStatusCard: React.FC = () => {
  const niftyMarket = useDataFetching<MarketSnapshot>('http://localhost:8001/api/data/nifty-snapshot');
  const bankNiftyMarket = useDataFetching<MarketSnapshot>('http://localhost:8001/api/data/banknifty-snapshot');
  const aiPredictions = useDataFetching<AIPrediction>('http://localhost:8003/api/ml/direction-prediction/NIFTY');
  const strategyRecommendations = useDataFetching<StrategyRecommendation>('http://localhost:8004/api/strategy/auto-select');
  const riskManagement = useDataFetching<PortfolioRisk>('http://localhost:8005/api/risk/portfolio-risk');
  const optionsAnalytics = useDataFetching<OptionsGreeks>('http://localhost:8006/api/options/greeks/NIFTY');
  const technicalAnalysis = useDataFetching<TechnicalIndicators>('http://localhost:8002/api/analysis/nifty-indicators/1hr');

  const marketServiceIsOnline = niftyMarket.isOnline && bankNiftyMarket.isOnline;
  const marketServiceIsLoading = niftyMarket.isLoading || bankNiftyMarket.isLoading;

  const serviceStatusesForDisplay = [
    { name: 'Market Data Service', isOnline: marketServiceIsOnline, isLoading: marketServiceIsLoading, error: niftyMarket.error || bankNiftyMarket.error },
    { name: 'AI Prediction Service', ...aiPredictions },
    { name: 'Strategy Service', ...strategyRecommendations },
    { name: 'Risk Management Service', ...riskManagement },
    { name: 'Options Analytics Service', ...optionsAnalytics },
    { name: 'Technical Analysis Service', ...technicalAnalysis },
  ];

  const anyLoading = serviceStatusesForDisplay.some(s => s.isLoading);
  const allOnline = !anyLoading && serviceStatusesForDisplay.every(s => s.isOnline);
  const offlineServices = serviceStatusesForDisplay.filter(s => !s.isLoading && !s.isOnline);
  const offlineCount = offlineServices.length;

  let overallStatusText = 'Checking services...';
  let OverallIcon = Loader2;
  let overallIconColor = 'text-muted-foreground';

  if (!anyLoading) {
    if (allOnline) {
      overallStatusText = 'All services operational';
      OverallIcon = CheckCircle2;
      overallIconColor = 'text-green-500';
    } else if (offlineCount > 0) {
      overallStatusText = `${offlineCount} service${offlineCount > 1 ? 's' : ''} offline`;
      OverallIcon = XCircle;
      overallIconColor = 'text-red-500';
    } else { // Should ideally not happen if not loading and not all online and no offline, but as a fallback
      overallStatusText = 'Status undetermined';
      OverallIcon = Wifi; // Generic status icon
      overallIconColor = 'text-muted-foreground';
    }
  }

  // For CardWrapper's own status indicator
  const cardWrapperIsLoading = anyLoading;
  const cardWrapperIsOnline = !anyLoading && allOnline;
  // We don't aggregate errors for the top-level CardWrapper status indicator, too complex for a small dot.
  // Individual errors are implicitly handled by `isOnline` for each service.
  const cardWrapperError = null; 
  const cardWrapperLastUpdated = null; // Not meaningful for an aggregate card

  return (
    <CardWrapper
      title="Overall Service Status"
      icon={Wifi}
      isLoading={cardWrapperIsLoading}
      isOnline={cardWrapperIsOnline}
      error={cardWrapperError}
      lastUpdated={cardWrapperLastUpdated}
      serviceName="System Monitor"
    >
      <div className="space-y-3">
        <div className={`flex items-center text-base sm:text-lg font-semibold ${overallIconColor} mb-2`}>
          <OverallIcon className={`h-5 w-5 sm:h-6 sm:w-6 mr-2 ${anyLoading ? 'animate-spin' : ''}`} />
          {overallStatusText}
        </div>
        <div className="space-y-1.5">
          {serviceStatusesForDisplay.map(service => (
            <ServiceStatusItem
              key={service.name}
              name={service.name}
              isOnline={service.isOnline}
              isLoading={service.isLoading}
            />
          ))}
        </div>
      </div>
    </CardWrapper>
  );
};

export default OverallServiceStatusCard;
