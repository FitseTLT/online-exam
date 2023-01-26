export const calculatePercentile = (rank: number, total: number) =>
    total === 0 ? 100 : 100 - ((rank - 1) / total) * 100;
