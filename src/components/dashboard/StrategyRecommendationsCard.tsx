'use client';

import type React from 'react';
import { Lightbulb, ShieldCheck, BarChartBig, Activity, Layers } from 'lucide-react';
import CardWrapper from '@/components/shared/CardWrapper';
import { useDataFetching } from '@/hooks/useDataFetching';
import type { StrategyRecommendation } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ValueWithIcon: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit?: string; badgeVariant?: "default" | "secondary" | "destructive" | "outline" | null | undefined; className?: string }> = ({ icon: Icon, label, value, unit, badgeVariant, className }) => (
  <div className={`flex items-start space-x-2 text-sm ${className}`}>
    <Icon className="h-4 w-4 text-accent mt-0.5" />
    <span className="text-muted-foreground">{label}:</span>
    {badgeVariant ? <Badge variant={badgeVariant}>{value}{unit}</Badge> : <span className="font-semibold">{value}{unit}</span>}
  </div>
);

const StrategyRecommendationsCard: React.FC = () => {
  const { data, isLoading, error, isOnline, lastUpdated } = useDataFetching<StrategyRecommendation>('http://localhost:8004/api/strategy/auto-select');

  if (isLoading && !data) {
     return (
      <CardWrapper title="Strategy Recommendation" icon={Lightbulb} isLoading={true} error={null} isOnline={true} lastUpdated={null} serviceName="Strategy Service">
        <div className="space-y-3 p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      title="Strategy Recommendation"
      icon={Lightbulb}
      isLoading={isLoading}
      error={error}
      isOnline={isOnline}
      lastUpdated={lastUpdated}
      serviceName="Strategy Service"
    >
      {data && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-accent">{data.strategyName} for {data.underlying}</h3>
          <ValueWithIcon icon={ShieldCheck} label="Confidence Score" value={data.confidenceScore.toFixed(1)} unit="/100" />
          <ValueWithIcon 
            icon={Activity} 
            label="Volatility" 
            value={data.volatilityAssessment} 
            badgeVariant={
              data.volatilityAssessment === 'LOW' ? 'secondary' :
              data.volatilityAssessment === 'MEDIUM' ? 'default' : 'destructive'
            }
          />
          <ValueWithIcon icon={BarChartBig} label="Risk/Reward Ratio" value={data.riskRewardRatio} />
          {data.details && (
            <div className="pt-2 border-t border-border mt-3">
              <h4 className="text-sm font-medium mb-1">Details:</h4>
              {data.details.legs && data.details.legs.length > 0 && (
                 <ValueWithIcon icon={Layers} label="Legs" value={data.details.legs.map(leg => `${leg.action} ${leg.contracts} ${leg.strike} ${leg.type}`).join(', ')} />
              )}
              <ValueWithIcon icon={TrendingUp} label="Max Profit" value={data.details.maxProfit === 'UNLIMITED' ? 'Unlimited' : data.details.maxProfit.toString()} />
              <ValueWithIcon icon={TrendingDown} label="Max Loss" value={data.details.maxLoss === 'UNLIMITED' ? 'Unlimited' : data.details.maxLoss.toString()} />
            </div>
          )}
        </div>
      )}
    </CardWrapper>
  );
};

export default StrategyRecommendationsCard;
