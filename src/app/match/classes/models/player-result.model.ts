import { User } from 'src/app/user-managment/classes/models/user.model';

export interface PlayerResult {
  userId: string;
  user: User;
  score: number;
  order: number;
  history: Array<Array<number>>;
}
