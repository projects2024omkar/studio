
'use client';

import React from 'react';
import { Cpu, TrendingUp, TrendingDown, Activity, Percent, Target, Zap } from 'lucide-react';
import CardWrapper from '@/components/shared/CardWrapper';
import { useDataFetching } from '@/hooks/useDataFetching';
import type { AIPrediction } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';

const ValueWithIcon: React.FC<{ icon: React.ElementType; label: string; value: string | number; unit?: string; className?: string }> = ({ icon: Icon, label, value, unit, className }) => (
  <div className={`flex items-center space-x-2 text-sm ${className}`}>
    <Icon className="h-4 w-4 text-accent" />
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-semibold">{value}{unit}</span>
  </div>
);

const AIPredictionsPanelCard: React.FC = () => {
  const { data, isLoading, error, isOnline, lastUpdated } = useDataFetching<AIPrediction>('http://localhost:8003/api/ml/direction-prediction/NIFTY');

  if (isLoading && !data) {
    return (
      <CardWrapper title="AI Predictions (NIFTY)" icon={Cpu} isLoading={true} error={null} isOnline={true} lastUpdated={null} serviceName="AI Prediction Service">
        <div className="space-y-3 p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardWrapper>
    );
  }
  
  const predictionDirection = data?.prediction?.direction;
  const predictionColor = predictionDirection === 'BULLISH' ? 'text-green-500' : predictionDirection === 'BEARISH' ? 'text-red-500' : 'text-muted-foreground';
  const PredictionIcon = predictionDirection === 'BULLISH' ? TrendingUp : predictionDirection === 'BEARISH' ? TrendingDown : Activity;

  return (
    <CardWrapper
      title="AI Predictions (NIFTY)"
      icon={Cpu}
      isLoading={isLoading}
      error={error}
      isOnline={isOnline}
      lastUpdated={lastUpdated}
      serviceName="AI Prediction Service"
    >
      {data && data.prediction && (
        <div className="space-y-3">
          <div className={`flex items-center text-lg font-semibold ${predictionColor}`}>
            <PredictionIcon className="h-6 w-6 mr-2" />
            Direction: {data.prediction.direction}
          </div>
          <ValueWithIcon 
            icon={Percent} 
            label="Confidence" 
            value={(data.prediction.confidence * 100).toFixed(1)} 
            unit="%" 
          />
          <ValueWithIcon 
            icon={Target} 
            label="Expected Movement" 
            value={data.prediction.expected_move ? `${data.prediction.expected_move.min} - ${data.prediction.expected_move.max}` : 'N/A'} 
          />
          <ValueWithIcon icon={Zap} label="Market Regime" value={data.marketRegime} />
        </div>
      )}
    </CardWrapper>
  );
};

export default AIPredictionsPanelCard;
