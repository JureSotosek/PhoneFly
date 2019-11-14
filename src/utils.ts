export const toImperial = (x: number): number => {
  return Math.round(x * 39.3701)
}

export const formatScore = (score: number): string => {
  return `${score.toFixed(2)}m / ${toImperial(score)}"`
}
