import { LegResult } from './leg-result.model';

export interface SetResult {
  legResults: LegResult[];
  winner: string;
}
