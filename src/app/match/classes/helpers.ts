import { Throw, ThrowType } from './models/throw.model';

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
