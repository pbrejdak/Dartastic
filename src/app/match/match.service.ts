import { Injectable } from '@angular/core';
import { GameMode } from './classes/game-mode.enum';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { Throw, ThrowType } from './classes/models/throw.model';
import { MatchResult } from './classes/models/match-result.model';
import { SetResult } from './classes/models/set-result.model';
import { LegResult } from './classes/models/leg-result.model';
import { PlayerResult } from './classes/models/player-result.model';
import { GAME_STATE } from './classes/game-state.enum';
import { checkWin } from './classes/helpers';
import { User } from '../shared/classes/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  constructor() { }

  private gameStateSource: BehaviorSubject<GAME_STATE> = new BehaviorSubject(GAME_STATE.NOT_STARTED);
  gameState$: Observable<GAME_STATE> = this.gameStateSource.asObservable();

  private currentPlayerResultsSource: ReplaySubject<PlayerResult[]> = new ReplaySubject();
  currentPlayerResults$: Observable<PlayerResult[]> = this.currentPlayerResultsSource.asObservable();

  private currentPlayerSource: BehaviorSubject<number> = new BehaviorSubject(null);
  currentPlayer$: Observable<number> = this.currentPlayerSource.asObservable();

  private matchResultSource: ReplaySubject<MatchResult> = new ReplaySubject();
  matchResult$: Observable<MatchResult> = this.matchResultSource.asObservable();

  private players: User[] = [];
  private legLength: number;
  private mode: GameMode;

  private matchResult: MatchResult;
  private currentSetResult: SetResult;
  private currentLegResult: LegResult;

  private legFinished: boolean = false;

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

  private checkPlayerReady(throws: Throw[]) {
    const currentUser = this.currentUser;

    if (this.playersReady.get(currentUser.username)) {
      return throws;
    } else {
      if (this.isDoubleIn && this.playersReady.get(currentUser.username)) {
        const [firstThrow, secondThrow, thirdThrow] = throws;

        if (firstThrow.type === ThrowType.DOUBLE) {
          throws = [secondThrow, thirdThrow];
          this.setReadyUser(currentUser);
          return throws;
        } else if (firstThrow.points === secondThrow.points) {
          throws = [thirdThrow];
          this.setReadyUser(currentUser);
          return throws;
        } else if (firstThrow.points === thirdThrow.points) {
          this.setReadyUser(currentUser);
          return null;
        } else {
          return null;
        }
      }
    }
  }

  private handleMatchThrows(throws: Throw[]) {

    // check if players ready if not check player throws
    // to see if player pass test
    throws = this.checkPlayerReady(throws);

    if (throws) {
      switch (this.mode) {
        case GameMode.SINGLE_OUT:
          this.handleSingleOut(throws);
          break;
      }
    }

    this.selectNextPlayer();
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

    this.handleLegFinished(currentUser.username);
  }

  private handleLegFinished(winner: string) {
    this.currentLegResult.winner = winner;
    this.currentSetResult.legResults.push(this.currentLegResult);
    this.initLegResult();

    this.legFinished = true;

    if (this.currentSetResult.legResults.length >= 3) {
      const isPlayerWin = checkWin(this.currentSetResult.legResults, 3);
      if (isPlayerWin) {
        this.handleSetFinished(isPlayerWin);
      }
    }
  }

  private handleSetFinished(winner: string) {
    this.currentSetResult.winner = winner;
    this.matchResult.setResults.push(this.currentSetResult);

    if (this.matchResult.setResults.length >= 2) {
      const isPlayerWin = checkWin(this.matchResult.setResults, 2);
      if (isPlayerWin) {
        this.handleMatchFinished(isPlayerWin)
      }
    }
  }

  private handleMatchFinished(winner: string) {
    this.matchResult.winner = winner;

    this.gameStateSource.next(GAME_STATE.END);
    this.matchResultSource.next(this.matchResult);
  }

  private selectNextPlayer() {
    if (this.legFinished) {
      this.legFinished = false;
      this.currentPlayerSource.next(0);
    } else {
      const currentIdx = this.currentPlayerSource.value;
      if (currentIdx >= this.players.length - 1) {
        this.currentPlayerSource.next(0);
      } else {
        this.currentPlayerSource.next(currentIdx + 1);
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

  private initLegResult() {
    const playerResults = this.players.map(
      player =>
        ({
          user: player,
          userId: player.username,
          score: this.legLength,
          history: []
        } as PlayerResult)
    );

    this.currentLegResult = {} as LegResult;
    this.currentLegResult.playerResults = playerResults;
  }

  initGame(players: User[], legLength: number = 501, mode: GameMode = GameMode.SINGLE_OUT) {
    this.cleanUp();
    this.players = players;
    this.legLength = legLength;
    this.mode = mode;

    this.initLegResult();

    if (this.mode === GameMode.DOUBLE_IN) {
      players.forEach(player => this.playersReady.set(player.username, false));
    } else {
      players.forEach(player => this.playersReady.set(player.username, true));
    }

    // this.scoreboardSource.next(scoreboardItems);
    this.gameStateSource.next(GAME_STATE.PLAYER_ORDER);
  }

  applyThrows(segments: Throw[]) {
    switch (this.gameStateSource.value) {
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
    const items = this.currentLegResult.playerResults;
    userIds.forEach((userId, order) => {
      const item = items.find(i => i.userId === userId);
      item.order = order;
    });

    this.currentPlayerResultsSource.next(items.sort((a, b) => (a.order > b.order ? 1 : -1)));
    this.startMatch();
  }

  startMatch() {
    this.currentPlayerSource.next(0);
    this.gameStateSource.next(GAME_STATE.MATCH);
  }
}
