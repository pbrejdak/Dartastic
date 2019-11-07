import { SetResult } from './set-result.model';
import { BaseResult } from './base-result.model';

export interface MatchResult extends BaseResult {
  setResults: SetResult[];
  winner: string;
}
