import { LeagueMatch } from './league-match.model';

export interface LeagueRound {
  id: string;
  number: number;
  finished: boolean;
  matches: LeagueMatch[];
}
