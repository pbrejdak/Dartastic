import { PlayerResult } from './player-result.model';
import { BaseResult } from './base-result.model';

export interface LegResult extends BaseResult {
  playerResults: PlayerResult[];
  winner: string;
}
