import { MatchConfig } from '../../../shared/classes/models/match-config.model';

export interface MatchLeagueConfig extends MatchConfig {
  maxRounds: number;
}
