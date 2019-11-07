import { User } from '../../../shared/classes/models/user.model';

export interface PlayerResult {
  userId: string;
  user: User;
  score: number;
  order: number;
  history: Array<Array<number>>;
}
