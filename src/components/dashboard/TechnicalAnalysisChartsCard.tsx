
'use client';

import type React from 'react';
import { LineChart as LucideLineChart, BarChart3, TrendingUp, TrendingDown, PercentSquare } from 'lucide-react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import CardWrapper from '@/components/shared/CardWrapper';
import { useDataFetching } from '@/hooks/useDataFetching';
import type { TechnicalIndicators, HistoricalPricePoint } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';

const ValueWithIcon: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit?: string; className?: string }> = ({ icon: Icon, label, value, unit, className }) => (
  <div className={`flex items-center space-x-2 text-xs ${className}`}>
    <Icon className="h-3.5 w-3.5 text-accent" />
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-semibold">{value}{unit}</span>
  </div>
);

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const TechnicalAnalysisChartsCard: React.FC = () => {
  const { data, isLoading, error, isOnline, lastUpdated } = useDataFetching<TechnicalIndicators>('http://localhost:8002/api/analysis/nifty-indicators/1hr');

  if (isLoading && !data) {
     return (
      <CardWrapper title="Technical Analysis (NIFTY 1hr)" icon={LucideLineChart} isLoading={true} error={null} isOnline={true} lastUpdated={null} serviceName="Technical Analysis Service">
        <div className="space-y-3 p-4">
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      title={`Technical Analysis (${data?.symbol || 'NIFTY'} ${data?.timeframe || '1hr'})`}
      icon={LucideLineChart}
      isLoading={isLoading}
      error={error}
      isOnline={isOnline}
      lastUpdated={lastUpdated}
      serviceName="Technical Analysis Service"
    >
      {data && (
        <div className="space-y-4">
          {data.historicalData && data.historicalData.length > 0 && (
            <div className="h-[200px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.historicalData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                    <XAxis 
                      dataKey="time" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8} 
                      tickFormatter={(value) => typeof value === 'string' ? value.slice(-5) : ''} // Assuming time is like "HH:MM:SS"
                      className="text-xs"
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={8} 
                      className="text-xs"
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                    <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <ValueWithIcon 
              icon={LucideLineChart} 
              label="Last Price" 
              value={typeof data.lastPrice === 'number' ? data.lastPrice.toFixed(2) : 'N/A'} 
            />
            <ValueWithIcon 
              icon={PercentSquare} 
              label="RSI" 
              value={typeof data.rsi === 'number' ? data.rsi.toFixed(1) : 'N/A'} 
            />
            <ValueWithIcon 
              icon={BarChart3} 
              label="Volume" 
              value={typeof data.volume === 'number' ? data.volume.toLocaleString() : 'N/A'} 
            />
             {data.supportLevels && data.supportLevels.length > 0 && 
                <ValueWithIcon icon={TrendingDown} label="Support" value={data.supportLevels.join(', ')} /> }
             {data.resistanceLevels && data.resistanceLevels.length > 0 && 
                <ValueWithIcon icon={TrendingUp} label="Resistance" value={data.resistanceLevels.join(', ')} /> }
          </div>
        </div>
      )}
    </CardWrapper>
  );
};

export default TechnicalAnalysisChartsCard;
