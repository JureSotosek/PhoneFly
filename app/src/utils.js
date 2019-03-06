export const toImperial = x => {
  return Math.round(x * 39.3701)
}

export const formatScore = score => {
  return `${score.toFixed(2)}m / ${toImperial(score)}"`
}
