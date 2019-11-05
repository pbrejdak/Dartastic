import { Injectable } from '@angular/core';
import { UserPair } from './classes/models/user-pair.model';
import { GameMode } from './classes/game-mode.enum';
import { Scoreboard } from './classes/models/scoreboard.model';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { User } from '../user-managment/classes/models/user.model';
import { tap, take, first } from 'rxjs/operators';
import { Throw, ThrowType } from './classes/models/throw.model';
import { MatchResult } from './classes/models/match-result.model';
import { SetResult } from './classes/models/set-result.model';
import { LegResult } from './classes/models/leg-result.model';
import { PlayerResult } from './classes/models/player-result.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  constructor() {}

  private gameStateSource: ReplaySubject<GAME_STATE> = new ReplaySubject();
  gameState$: Observable<GAME_STATE> = this.gameStateSource.asObservable();

  // private scoreboardSource: BehaviorSubject<LegResult[]> = new BehaviorSubject([]);
  // scoreboard$: Observable<LegResult[]> = this.scoreboardSource.asObservable();

  private currentPlayerSource: BehaviorSubject<number> = new BehaviorSubject(null);
  currentPlayer$: Observable<number> = this.currentPlayerSource.asObservable();

  private players: User[] = [];
  private legLength: number;
  private mode: GameMode;

  private matchResult: MatchResult;
  private currentSetResult: SetResult;
  private currentLegResult: LegResult;

  private get isDoubleIn() {
    return this.mode === GameMode.DOUBLE_IN;
  }

  private get currentUser() {
    return this.players[this.currentPlayerSource.value];
  }

  /**
   * key - userId (username)
   * value - isReady
   */
  private playersReady = new Map<string, boolean>();

  private setReadyUser(user: User) {
    this.playersReady.set(user.username, true);
  }

  private checkPlayerReady() {}

  private handleMatchThrows(segments: Throw[]) {
    const currentUser = this.currentUser;
    if (this.isDoubleIn && this.playersReady.get(currentUser.username)) {
      const [firstThrow, secondThrow, thirdThrow] = segments;

      if (firstThrow.type === ThrowType.DOUBLE) {
        segments = [secondThrow, thirdThrow];
        this.setReadyUser(currentUser);
      } else if (firstThrow.points === secondThrow.points) {
        segments = [thirdThrow];
        this.setReadyUser(currentUser);
      } else if (firstThrow.points === thirdThrow.points) {
        this.setReadyUser(currentUser);
        return;
      } else {
        return;
      }
    }

    switch (this.mode) {
      case GameMode.SINGLE_OUT:
        this.handleSingleOut(segments);
        break;
    }
  }

  private handleSingleOut(throws: Throw[]) {
    const currentUser = this.currentUser;
    const playerResults = this.currentLegResult.playerResults.find(p => p.userId === currentUser.username);

    let legFinished = false;
    for (const playerThrow of throws) {
      if (playerResults.score < playerThrow.points) {
        continue;
      }

      playerResults.score -= playerThrow.points;

      if (playerResults.score === 0) {
        legFinished = true;
        break;
      }
    }

    this.handleLegFinished(currentUser);
  }

  private handleLegFinished(winner: User) {
    this.currentLegResult.winner = winner.username;
    this.currentSetResult.legResults.push(this.currentLegResult);

    if (this.currentSetResult.legResults.length >= 3) {
      const winnersMap = new Map<string, number>();
      for (const legResult of this.currentSetResult.legResults) {
        if (!winnersMap.has(legResult.winner)) {
          winnersMap.set(legResult.winner, 0);
        }
        const nWins = winnersMap.get(legResult.winner);
        winnersMap.set(legResult.winner, nWins + 1);
      }
    }
  }

  private cleanUp() {
    this.matchResult = {} as MatchResult;
    this.matchResult.setResults = [];

    this.currentSetResult = {} as SetResult;
    this.currentSetResult.legResults = [];

    this.currentLegResult = {} as LegResult;
    this.currentLegResult.playerResults = [];
  }

  initGame(players: User[], legLength: number = 501, mode: GameMode = GameMode.SINGLE_OUT) {
    this.cleanUp();
    this.players = players;
    this.legLength = legLength;
    this.mode = mode;

    const playerResults = players.map(
      player =>
        ({
          user: player,
          userId: player.username,
          score: legLength,
          history: []
        } as PlayerResult)
    );

    this.currentLegResult.playerResults = playerResults;

    if (this.mode === GameMode.DOUBLE_IN) {
      players.forEach(player => this.playersReady.set(player.username, false));
    } else {
      players.forEach(player => this.playersReady.set(player.username, true));
    }

    // this.scoreboardSource.next(scoreboardItems);
    this.gameStateSource.next(GAME_STATE.PLAYER_ORDER);
  }

  applyThrows(segments: Throw[]) {
    switch (this.game) {
      case GAME_STATE.PLAYER_ORDER:
        break;
      case GAME_STATE.MATCH:
        this.handleMatchThrows(segments);
        break;
      case GAME_STATE.END:
        break;
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

    this.scoreboardSource.next(items.sort((a, b) => (a.order > b.order ? 1 : -1)));
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
