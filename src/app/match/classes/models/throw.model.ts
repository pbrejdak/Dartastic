export interface Throw {
  points: number;
  type: ThrowType;
  fieldId: string;
}

export enum ThrowType {
  SINGLE,
  DOUBLE,
  TRIPLE,
  OUTER,
  BULL
}
