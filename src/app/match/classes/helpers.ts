import { Throw, ThrowType } from './models/throw.model';
import { BaseResult } from './models/base-result.model';

/**
 * convert simple segment id (svg path id) to proper object
 * with points, type and fieldId (svg path id)
 */
export const segmentToPoints = (segment: string) => {
  const throwDart = {} as Throw;
  throwDart.fieldId = segment;

  if (segment.startsWith('s')) {
    throwDart.points = parseInt(segment.substr(1), 10);
    throwDart.type = ThrowType.SINGLE;
  } else if (segment.startsWith('d')) {
    throwDart.points = parseInt(segment.substr(1), 10) * 2;
    throwDart.type = ThrowType.DOUBLE;
  } else if (segment.startsWith('t')) {
    throwDart.points = parseInt(segment.substr(1), 10) * 3;
    throwDart.type = ThrowType.TRIPLE;
  } else if (segment === 'Outer') {
    throwDart.points = 25;
    throwDart.type = ThrowType.OUTER;
  } else if (segment === 'Bull') {
    throwDart.points = 50;
    throwDart.type = ThrowType.BULL;
  }

  return throwDart;
};

/**
 * check if any player win game
 * @param results base results model
 * @param treshold how many wins needed to win leg/set/match
 * 
 * returns username if player win, otherwise returns null
 */
export const checkWin = (results: BaseResult[], treshold: number): string | null => {
  const winnersMap = new Map<string, number>();
  for (const result of results) {
    if (!winnersMap.has(result.winner)) {
      winnersMap.set(result.winner, 0);
    }
    const nWins = winnersMap.get(result.winner) + 1;
    winnersMap.set(result.winner, nWins);

    if (nWins === treshold) {
      return result.winner;
    }
  }

  return null;
}