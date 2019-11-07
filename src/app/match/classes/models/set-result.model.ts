import { LegResult } from './leg-result.model';
import { BaseResult } from './base-result.model';

export interface SetResult extends BaseResult {
  legResults: LegResult[];
  winner: string;
}
