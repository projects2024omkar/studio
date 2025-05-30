
'use client';

import type React from 'react';
import { Briefcase, ShieldAlert, Percent, BarChartHorizontalBig, TrendingDown } from 'lucide-react';
import CardWrapper from '@/components/shared/CardWrapper';
import { useDataFetching } from '@/hooks/useDataFetching';
import type { PortfolioRisk } from '@/types/api';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const ValueWithIcon: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit?: string; className?: string }> = ({ icon: Icon, label, value, unit, className }) => (
  <div className={`flex items-center space-x-2 text-sm ${className}`}>
    <Icon className="h-4 w-4 text-accent" />
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-semibold">{value}{unit}</span>
  </div>
);

const RiskManagementDashboardCard: React.FC = () => {
  const { data, isLoading, error, isOnline, lastUpdated } = useDataFetching<PortfolioRisk>('http://localhost:8005/api/risk/portfolio-risk');

  if (isLoading && !data) {
    return (
      <CardWrapper title="Risk Management" icon={Briefcase} isLoading={true} error={null} isOnline={true} lastUpdated={null} serviceName="Risk Service">
        <div className="space-y-4 p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      title="Risk Management"
      icon={Briefcase}
      isLoading={isLoading}
      error={error}
      isOnline={isOnline}
      lastUpdated={lastUpdated}
      serviceName="Risk Service"
    >
      {data && (
        <div className="space-y-4">
          <ValueWithIcon 
            icon={Briefcase} 
            label="Portfolio Value" 
            value={typeof data.portfolioValue === 'number' ? data.portfolioValue.toLocaleString() : 'N/A'} 
            unit={typeof data.portfolioValue === 'number' ? " INR" : ""} 
          />
          <ValueWithIcon 
            icon={ShieldAlert} 
            label={data.valueAtRisk && typeof data.valueAtRisk.confidenceLevel === 'number' ? `VaR (${(data.valueAtRisk.confidenceLevel * 100).toFixed(0)}%)` : 'VaR (N/A)'} 
            value={data.valueAtRisk && typeof data.valueAtRisk.amount === 'number' ? data.valueAtRisk.amount.toLocaleString() : 'N/A'} 
            unit={data.valueAtRisk && typeof data.valueAtRisk.amount === 'number' ? " INR" : ""} 
          />
          <div>
            <ValueWithIcon 
              icon={Percent} 
              label="Risk Utilization" 
              value={typeof data.riskUtilizationPercent === 'number' ? data.riskUtilizationPercent.toFixed(1) : 'N/A'} 
              unit={typeof data.riskUtilizationPercent === 'number' ? "%" : ""} 
            />
            <Progress value={typeof data.riskUtilizationPercent === 'number' ? data.riskUtilizationPercent : 0} className="h-2 mt-1" />
          </div>
          <ValueWithIcon 
            icon={BarChartHorizontalBig} 
            label="Active Positions" 
            value={typeof data.activePositions === 'number' ? data.activePositions : 'N/A'} 
          />
          <ValueWithIcon 
            icon={TrendingDown} 
            label="Max Drawdown" 
            value={data.maxDrawdown && typeof data.maxDrawdown.amount === 'number' && typeof data.maxDrawdown.percent === 'number' 
              ? `${data.maxDrawdown.amount.toLocaleString()} INR (${data.maxDrawdown.percent.toFixed(1)}%)` 
              : 'N/A'} 
          />
        </div>
      )}
    </CardWrapper>
  );
};

export default RiskManagementDashboardCard;
