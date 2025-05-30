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
          <ValueWithIcon icon={Briefcase} label="Portfolio Value" value={data.portfolioValue.toLocaleString()} unit=" INR" />
          <ValueWithIcon icon={ShieldAlert} label={`VaR (${(data.valueAtRisk.confidenceLevel * 100).toFixed(0)}%)`} value={data.valueAtRisk.amount.toLocaleString()} unit=" INR" />
          <div>
            <ValueWithIcon icon={Percent} label="Risk Utilization" value={data.riskUtilizationPercent.toFixed(1)} unit="%" />
            <Progress value={data.riskUtilizationPercent} className="h-2 mt-1" />
          </div>
          <ValueWithIcon icon={BarChartHorizontalBig} label="Active Positions" value={data.activePositions} />
          <ValueWithIcon icon={TrendingDown} label="Max Drawdown" value={`${data.maxDrawdown.amount.toLocaleString()} INR (${data.maxDrawdown.percent.toFixed(1)}%)`} />
        </div>
      )}
    </CardWrapper>
  );
};

export default RiskManagementDashboardCard;
