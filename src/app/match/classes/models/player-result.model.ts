import { User } from '../../../shared/classes/models/user.model';
import { Throw } from './throw.model';

export interface PlayerResult {
  userId: string;
  user: User;
  score: number;
  order: number;
  history: Array<Throw[]>;
}
