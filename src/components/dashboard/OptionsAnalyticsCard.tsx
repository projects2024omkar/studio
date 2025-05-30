'use client';

import type React from 'react';
import { Sigma, ArrowRightLeft, Hourglass, Wind, TrendingUp } from 'lucide-react'; // Sigma might not exist in Lucide, using placeholders
import CardWrapper from '@/components/shared/CardWrapper';
import { useDataFetching } from '@/hooks/useDataFetching';
import type { OptionsGreeks } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';

// Using available icons that are somewhat relevant
const GreekIcon = ({ greekName }: { greekName: string }) => {
  switch (greekName.toLowerCase()) {
    case 'delta': return <ArrowRightLeft className="h-4 w-4 text-accent" />; // Movement
    case 'gamma': return <TrendingUp className="h-4 w-4 text-accent" />; // Rate of change
    case 'theta': return <Hourglass className="h-4 w-4 text-accent" />; // Time decay
    case 'vega': return <Wind className="h-4 w-4 text-accent" />; // Volatility
    default: return <Sigma className="h-4 w-4 text-accent" />; // Generic
  }
};


const ValueWithGreekIcon: React.FC<{ greekName: string; label: string; value: string | number; unit?: string; className?: string }> = ({ greekName, label, value, unit, className }) => (
  <div className={`flex items-center space-x-2 text-sm ${className}`}>
    <GreekIcon greekName={greekName} />
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-semibold">{value}{unit}</span>
  </div>
);


const OptionsAnalyticsCard: React.FC = () => {
  const { data, isLoading, error, isOnline, lastUpdated } = useDataFetching<OptionsGreeks>('http://localhost:8006/api/options/greeks/NIFTY');

  if (isLoading && !data) {
    return (
      <CardWrapper title="Portfolio Greeks (NIFTY)" icon={Sigma} isLoading={true} error={null} isOnline={true} lastUpdated={null} serviceName="Options Analytics Service">
        <div className="space-y-3 p-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      title="Portfolio Greeks (NIFTY)"
      icon={Sigma} // Main card icon
      isLoading={isLoading}
      error={error}
      isOnline={isOnline}
      lastUpdated={lastUpdated}
      serviceName="Options Analytics Service"
    >
      {data && (
        <div className="space-y-3">
          <ValueWithGreekIcon greekName="Delta" label="Portfolio Delta" value={data.portfolioDelta.toFixed(2)} />
          <ValueWithGreekIcon greekName="Gamma" label="Portfolio Gamma" value={data.portfolioGamma.toFixed(4)} />
          <ValueWithGreekIcon greekName="Theta" label="Portfolio Theta" value={data.portfolioTheta.toFixed(2)} />
          <ValueWithGreekIcon greekName="Vega" label="Portfolio Vega" value={data.portfolioVega.toFixed(2)} />
        </div>
      )}
    </CardWrapper>
  );
};

export default OptionsAnalyticsCard;
