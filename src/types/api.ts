export interface MarketSnapshot {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  lastUpdated: string;
}

export interface AIPrediction {
  symbol: string;
  prediction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number; // 0.0 to 1.0
  expectedPriceMovement: {
    min: number;
    max: number;
  };
  marketRegime: string; // e.g., "Trending", "Volatile", "Sideways"
  lastUpdated: string;
}

export interface StrategyRecommendation {
  strategyName: string;
  underlying: string;
  confidenceScore: number; // 0 to 100
  volatilityAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  riskRewardRatio: string; // e.g., "1:2.5"
  details?: {
    // Specific to strategy, e.g., for options
    legs?: { type: 'CALL' | 'PUT'; strike: number; action: 'BUY' | 'SELL'; contracts: number }[];
    maxProfit: number | 'UNLIMITED';
    maxLoss: number | 'UNLIMITED';
    breakevenPoints: number[];
  };
  lastUpdated: string;
}

export interface PortfolioRisk {
  portfolioValue: number;
  valueAtRisk: {
    amount: number;
    confidenceLevel: number; // e.g., 0.95 for 95%
  };
  riskUtilizationPercent: number;
  activePositions: number;
  maxDrawdown: {
    amount: number;
    percent: number;
  };
  lastUpdated: string;
}

export interface OptionsGreeks {
  symbol: string;
  portfolioDelta: number;
  portfolioGamma: number;
  portfolioTheta: number;
  portfolioVega: number;
  lastUpdated: string;
}

export interface HistoricalPricePoint {
  time: string; // Could be timestamp or formatted string
  price: number;
}

export interface TechnicalIndicators {
  symbol: string;
  timeframe: string; // e.g., "1hr", "1D"
  lastPrice: number;
  supportLevels: number[];
  resistanceLevels: number[];
  rsi: number;
  volume: number;
  historicalData: HistoricalPricePoint[];
  lastUpdated: string;
}

// Generic error type for API responses
export interface ApiError {
  message: string;
  statusCode?: number;
}
