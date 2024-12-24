interface Trend {
  direction: 'up' | 'down';
  percentage: number;
}

export function calculateTrend(previous: number, current: number): Trend {
  if (previous === 0) {
    return {
      direction: current > 0 ? 'up' : 'down',
      percentage: current > 0 ? 100 : 0
    };
  }

  const percentageChange = ((current - previous) / previous) * 100;
  
  return {
    direction: percentageChange >= 0 ? 'up' : 'down',
    percentage: Math.abs(percentageChange)
  };
}