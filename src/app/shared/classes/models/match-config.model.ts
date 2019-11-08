import { User } from './user.model';
import { GameMode } from '../game-mode.enum';

export interface MatchConfig {
  players: User[];
  mode: GameMode;
  legLength: number;
  legsNeededToFinish: number;
  setsNeededToFinish: number;
}
