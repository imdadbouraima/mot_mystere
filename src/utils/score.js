export function calculerPoints(nombreEssais, longueur, modeDifficile) {
  const pointsDeBase = Math.max(1, 7 - nombreEssais);
  return Math.round(pointsDeBase * (longueur === 6 ? 1.5 : longueur === 7 ? 2 : 1) * (modeDifficile ? 1.5 : 1));
}
