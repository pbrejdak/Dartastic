import { User } from '../../../shared/classes/models/user.model';

export interface MatchScore {
  /**
   * key - userId
   */
  [key: string]: Score;
}

export interface Score {
  wonSets: number;
  wonLegs: number;
  //   scoreLeft: number;
  //   user: User[];
}
