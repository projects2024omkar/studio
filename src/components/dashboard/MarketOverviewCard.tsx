'use client';

import type React from 'react';
import { TrendingUp, TrendingDown, Minus, Landmark, Activity } from 'lucide-react';
import CardWrapper from '@/components/shared/CardWrapper';
import { useDataFetching } from '@/hooks/useDataFetching';
import type { MarketSnapshot } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';

const MarketDataDisplay: React.FC<{
  data: MarketSnapshot | null;
  isLoading: boolean;
  error: any;
  title: string;
}> = ({ data, isLoading, error, title }) => {
  
  if (isLoading && !data) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!data) return null; // Error or no data handled by CardWrapper

  const TrendIcon = data.trend === 'BULLISH' ? TrendingUp : data.trend === 'BEARISH' ? TrendingDown : Minus;
  const trendColor = data.trend === 'BULLISH' ? 'text-green-500' : data.trend === 'BEARISH' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="space-y-2">
      <h3 className="text-lg sm:text-xl font-semibold">{data.symbol}</h3>
      <p className={`text-2xl sm:text-3xl font-bold ${trendColor}`}>{data.price.toFixed(2)}</p>
      <div className={`flex items-center text-sm ${trendColor}`}>
        <TrendIcon className="h-4 w-4 mr-1" />
        <span>
          {data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
        </span>
      </div>
      <p className="text-xs text-muted-foreground">Trend: {data.trend}</p>
    </div>
  );
};

const MarketOverviewCard: React.FC = () => {
  const nifty = useDataFetching<MarketSnapshot>('http://localhost:8001/api/data/nifty-snapshot');
  const bankNifty = useDataFetching<MarketSnapshot>('http://localhost:8001/api/data/banknifty-snapshot');

  // Determine overall status for CardWrapper based on both fetches
  const isLoading = nifty.isLoading || bankNifty.isLoading;
  const isOnline = nifty.isOnline && bankNifty.isOnline;
  // Combine errors or pick one if multiple
  const error = nifty.error || bankNifty.error; 
  // Use the latest update time
  const lastUpdated = Math.max(nifty.lastUpdated || 0, bankNifty.lastUpdated || 0) || null;

  return (
    <CardWrapper
      title="Market Overview"
      icon={Activity}
      isLoading={isLoading}
      error={error}
      isOnline={isOnline}
      lastUpdated={lastUpdated}
      serviceName="Market Data Service"
      contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <MarketDataDisplay data={nifty.data} isLoading={nifty.isLoading} error={nifty.error} title="NIFTY" />
      <MarketDataDisplay data={bankNifty.data} isLoading={bankNifty.isLoading} error={bankNifty.error} title="BANKNIFTY" />
    </CardWrapper>
  );
};

export default MarketOverviewCard;
