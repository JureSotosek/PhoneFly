export const toImperial: (x: number) => number = x => {
  return Math.round(x * 39.3701)
}

export const formatScore: (score: number) => string = score => {
  return `${score.toFixed(2)}m / ${toImperial(score)}"`
}
