import { PlayerResult } from './player-result.model';

export interface LegResult {
  playerResults: PlayerResult[];
  winner: string;
}
