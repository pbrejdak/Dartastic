import { SetResult } from './set-result.model';
import { BaseResult } from './base-result.model';
import { MatchType } from '../match-type.enum';

export interface MatchResult extends BaseResult {
  setResults: SetResult[];
  participants: string[];
  type: MatchType;
  winner: string;
  finishedAt: Date;
}
