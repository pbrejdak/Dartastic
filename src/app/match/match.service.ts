import { Injectable } from '@angular/core';
import { UserPair } from './classes/models/user-pair.model';
import { GameMode } from './classes/game-mode.enum';
import { ScoreboardItem } from './classes/models/scoreboard-item.model';
import { Scoreboard } from './classes/models/scoreboard.model';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { User } from '../user-managment/classes/models/user.model';
import { tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor() { }

  private gameStateSource: ReplaySubject<GAME_STATE> = new ReplaySubject();
  gameState$: Observable<GAME_STATE> = this.gameStateSource.asObservable();

  private scoreboardSource: BehaviorSubject<ScoreboardItem[]> = new BehaviorSubject([]);
  scoreboard$: Observable<ScoreboardItem[]> = this.scoreboardSource.asObservable();

  private currentPlayerSource: ReplaySubject<number> = new ReplaySubject();
  currentPlayer$: Observable<number> = this.currentPlayerSource.asObservable();

  private players: User[] = [];
  private legLength: number;
  private mode: GameMode;

  private handleMatchThrows(segments: string[]) {

  }

  initGame(players: User[], legLength: number = 501, mode: GameMode = GameMode.SINGLE_OUT) {
    this.players = players;
    this.legLength = legLength;
    this.mode = mode;

    const scoreboardItems = players.map(player => ({
      user: player,
      userId: player.username,
      score: legLength,
      history: []
    } as ScoreboardItem));

    this.scoreboardSource.next(scoreboardItems);
    this.gameStateSource.next(GAME_STATE.PLAYER_ORDER);
  }

  applyThrows(segments: string[]) {
    switch (this.state) {
      case GAME_STATE.PLAYER_ORDER: break;
      case GAME_STATE.MATCH: this.handleMatchThrows(segments); break;
      case GAME_STATE.END: break;
    }
  }

  /**
   * set play order for users
   * @param userIds at index 0 is player that is gonna start the game, at last index is last player.
   */
  setPlayerOrder(userIds: string[]) {
    const items = [...this.scoreboardSource.value];
    userIds.forEach((userId, order) => {
      const item = items.find(i => i.userId === userId);
      item.order = order;
    });

    this.scoreboardSource.next(items.sort((a, b) => a.order > b.order ? 1 : -1));
    this.startMatch();
  }

  startMatch() {
    this.currentPlayerSource.next(0);
    this.gameStateSource.next(GAME_STATE.MATCH);
  }
}

enum GAME_STATE {
  PLAYER_ORDER,
  MATCH,
  END
}
