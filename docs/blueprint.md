# **App Name**: AlgoTradeView

## Core Features:

- Market Overview: Display real-time NIFTY and BANKNIFTY prices, percentage changes, and color-coded trend indicators.
- AI Predictions Panel: Show ML direction prediction (BULLISH/BEARISH/NEUTRAL) with confidence, expected price movement, and market regime. Data from: http://localhost:8003/api/ml/direction-prediction/NIFTY
- Strategy Recommendations: Display the recommended options strategy, confidence score, volatility assessment, and risk-reward ratio. Data from: http://localhost:8004/api/strategy/auto-select
- Risk Management Dashboard: Present portfolio value, VaR, risk utilization, active positions, and maximum drawdown metrics. Data from: http://localhost:8005/api/risk/portfolio-risk
- Options Analytics: Provide a live-updated summary of Portfolio Greeks. Specifically: Delta, Gamma, Theta, and Vega. Data from: http://localhost:8006/api/options/greeks/NIFTY
- Technical Analysis Charts: Multi-timeframe price charts with technical indicators, support/resistance levels, RSI, and volume analysis. Data from: http://localhost:8002/api/analysis/nifty-indicators/1hr
- Real-time Data Handling: Auto-refresh data from microservices every 30 seconds. Display service status indicators and handle errors gracefully. Data from: http://localhost:8001/api/data/nifty-snapshot and http://localhost:8001/api/data/banknifty-snapshot

## Style Guidelines:

- Primary color: Deep midnight blue (#2C3E50) to evoke a sense of professionalism and stability in the financial context. It provides a solid, trustworthy base.
- Background color: Almost-black (#1E293B), a desaturated near-match to the primary, reinforces the dark theme, reducing eye strain and focusing attention on data.
- Accent color: A vibrant, slightly cool green (#3498DB), chosen as an analogue to the midnight blue but contrasting it by being lighter and more saturated. This hue signifies growth, profit, and positive movement in the market, crucial for a trading dashboard.
- Clean, readable sans-serif font for data clarity.
- Sharp, minimalist icons for financial metrics.
- Grid layout with card-based design for organized data.
- Subtle pulsing effects for live data updates.