import { Injectable } from '@angular/core';
import { GameMode } from '../shared/classes/game-mode.enum';
import { ReplaySubject, Observable, BehaviorSubject } from 'rxjs';
import { Throw, ThrowType } from './classes/models/throw.model';
import { MatchResult } from './classes/models/match-result.model';
import { SetResult } from './classes/models/set-result.model';
import { LegResult } from './classes/models/leg-result.model';
import { PlayerResult } from './classes/models/player-result.model';
import { GAME_STATE } from './classes/game-state.enum';
import { checkWin } from './classes/helpers';
import { User } from '../shared/classes/models/user.model';
import { MatchEvent } from './classes/models/match-event.model';
import { MatchEventType } from './classes/match-event-type.enum';
import { MatchScore, Score } from './classes/models/match-score.model';
import { MatchType } from './classes/match-type.enum';
import { ApiService, ApiKey } from '../shared/api.service';
import { take, tap, switchMap } from 'rxjs/operators';
import { MatchConfig } from '../shared/classes/models/match-config.model';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  constructor(private api: ApiService) {}

  private gameStateSource: BehaviorSubject<GAME_STATE> = new BehaviorSubject(GAME_STATE.NOT_STARTED);
  gameState$: Observable<GAME_STATE> = this.gameStateSource.asObservable();

  private currentPlayersResultsSource: ReplaySubject<PlayerResult[]> = new ReplaySubject();
  currentPlayersResults$: Observable<PlayerResult[]> = this.currentPlayersResultsSource.asObservable();

  private currentPlayerSource: BehaviorSubject<string> = new BehaviorSubject(null);
  currentPlayer$: Observable<string> = this.currentPlayerSource.asObservable();

  private matchResultSource: ReplaySubject<MatchResult> = new ReplaySubject();
  matchResult$: Observable<MatchResult> = this.matchResultSource.asObservable();

  private matchScoreSource: BehaviorSubject<MatchScore> = new BehaviorSubject(null);
  matchScore$: Observable<MatchScore> = this.matchScoreSource.asObservable();

  private playersSource: ReplaySubject<User[]> = new ReplaySubject<User[]>();
  players$: Observable<User[]> = this.playersSource.asObservable();

  private matchEventsSource: ReplaySubject<MatchEvent> = new ReplaySubject();
  matchEvent$: Observable<MatchEvent> = this.matchEventsSource.asObservable();

  private players: User[] = [];
  private legLength: number;
  private mode: GameMode;
  private legsNeededToFinish: number;
  private setsNeededToFinish: number;
  private matchType: MatchType;

  private matchEvent: MatchEvent = null;

  private matchResult: MatchResult;
  private currentSetResult: SetResult;
  private currentLegResult: LegResult;

  private currentPlayerIdx: number = 0;

  private legFinished: boolean = false;

  private get isDoubleIn() {
    return this.mode === GameMode.DOUBLE_IN;
  }

  private get currentUser() {
    return this.players[this.currentPlayerIdx];
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

    if (this.matchEvent) {
      this.matchEventsSource.next(this.matchEvent);
      this.matchEvent = null;
    }

    this.selectNextPlayer();
    // this.
  }

  // #region handle throws by game mode
  private handleSingleOut(throws: Throw[]) {
    const currentUser = this.currentUser;
    const playerResults = this.currentLegResult.playerResults.find(p => p.userId === currentUser.username);

    playerResults.history.push(throws);

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

    if (legFinished) {
      this.handleLegFinished(currentUser.username);
    }
  }
  // #endregion

  // #region handle wins
  private handleLegFinished(winner: string) {
    this.currentLegResult.winner = winner;
    this.currentSetResult.legResults.push(this.currentLegResult);
    this.matchEvent = new MatchEvent(MatchEventType.LEG_END, `Player ${this.getPlayerName(winner)} won leg`);
    this.initLegResult();

    const score = this.matchScoreSource.value;
    score[winner].wonLegs++;
    this.matchScoreSource.next(score);

    this.currentPlayersResultsSource.next(this.currentLegResult.playerResults);

    this.legFinished = true;

    if (this.currentSetResult.legResults.length >= this.legsNeededToFinish) {
      const isPlayerWin = checkWin(this.currentSetResult.legResults, this.legsNeededToFinish);
      if (isPlayerWin) {
        this.handleSetFinished(isPlayerWin);
      }
    }
  }

  private handleSetFinished(winner: string) {
    this.currentSetResult.winner = winner;
    this.matchResult.setResults.push(this.currentSetResult);
    this.matchEvent = new MatchEvent(MatchEventType.SET_END, `Player ${this.getPlayerName(winner)} won set`);

    const score = this.matchScoreSource.value;
    score[winner].wonSets++;
    this.matchScoreSource.next(score);

    if (this.matchResult.setResults.length >= this.setsNeededToFinish) {
      const isPlayerWin = checkWin(this.matchResult.setResults, this.setsNeededToFinish);
      if (isPlayerWin) {
        this.handleMatchFinished(isPlayerWin);
      }
    }
  }

  private handleMatchFinished(winner: string) {
    this.matchResult.winner = winner;
    this.matchResult.participants = this.players.map(p => p.username);
    this.matchResult.type = this.matchType;
    this.matchResult.finishedAt = new Date();
    this.matchEvent = new MatchEvent(MatchEventType.MATCH_END, `Player ${this.getPlayerName(winner)} won match`);

    this.api
      .getData<MatchResult[]>(ApiKey.HISTORY)
      .pipe(
        take(1),
        switchMap((history: MatchResult[]) => this.api.saveData(ApiKey.HISTORY, history.concat(this.matchResult)))
      )
      .subscribe();

    this.gameStateSource.next(GAME_STATE.END);
    this.matchResultSource.next(this.matchResult);
  }
  // #endregion

  private selectNextPlayer() {
    if (this.legFinished) {
      this.legFinished = false;
      this.currentPlayerIdx = 0;
    } else {
      const currentIdx = this.currentPlayerIdx;
      if (currentIdx >= this.players.length - 1) {
        this.currentPlayerIdx = 0;
      } else {
        this.currentPlayerIdx = currentIdx + 1;
      }
    }

    this.forwardCurrentPlayer();
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

  private getPlayerName(userId: string): string {
    const user = this.players.find(p => p.username === userId);
    return `${user.name} ${user.surname}`;
  }

  private forwardCurrentPlayer() {
    this.currentPlayerSource.next(this.players[this.currentPlayerIdx].username);
  }

  initGame(config: MatchConfig, matchType: MatchType) {
    this.cleanUp();
    this.players = config.players;
    this.legLength = config.legLength;
    this.mode = config.mode;
    this.legsNeededToFinish = config.legsNeededToFinish;
    this.setsNeededToFinish = config.setsNeededToFinish;
    this.matchType = matchType;

    this.initLegResult();

    const matchScore = {} as MatchScore;
    this.players.forEach(player => {
      const playerScore = {} as Score;
      playerScore.wonLegs = 0;
      playerScore.wonSets = 0;
      matchScore[player.username] = playerScore;
    });
    this.matchScoreSource.next(matchScore);

    this.playersSource.next(config.players);

    if (this.mode === GameMode.DOUBLE_IN) {
      config.players.forEach(player => this.playersReady.set(player.username, false));
    } else {
      config.players.forEach(player => this.playersReady.set(player.username, true));
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

    this.currentPlayersResultsSource.next(items.sort((a, b) => (a.order > b.order ? 1 : -1)));
    this.startMatch();
  }

  startMatch() {
    this.currentPlayerIdx = 0;
    this.forwardCurrentPlayer();
    this.gameStateSource.next(GAME_STATE.MATCH);
  }
}
