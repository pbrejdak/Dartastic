import { MatchLeagueConfig } from './match-league-config.model';
import { LeagueRound } from './league-round.model';

export interface League {
  id: string;
  name: string;
  participants: string[];
  totalRounds: number;
  winner: string;
  config: MatchLeagueConfig;
  rounds: LeagueRound[];
}
