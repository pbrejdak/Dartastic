import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatchService } from '../match.service';
import { Throw } from '../classes/models/throw.model';
import { GAME_STATE } from '../classes/game-state.enum';
import { Subscription, fromEvent, combineLatest, Observable } from 'rxjs';
import { MatchEventType } from '../classes/match-event-type.enum';
import { MatDialog } from '@angular/material/dialog';
import { MatchEvent } from '../classes/models/match-event.model';
import { MatchEventDialogComponent } from '../match-event-dialog/match-event-dialog.component';
import { filter, map } from 'rxjs/operators';

export interface PlayerScore {
  displayName: string;
  username: string;
  wonSets: number;
  wonLegs: number;
  pointsLeft: number;
  isPlaying: boolean;
  throwsNeeded: number;
  lastAverage: number;
}

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(public matchService: MatchService, private matDialog: MatDialog) {}

  dartboardWidth: number;
  dartboardHeight: number;

  score$: Observable<PlayerScore[]> = combineLatest(
    this.matchService.currentPlayersResults$,
    this.matchService.matchScore$.pipe(filter(score => !!score)),
    this.matchService.currentPlayer$
  ).pipe(
    map(([playerResults, score, currentPlayerId]) =>
      playerResults.map(player => {
        const { wonSets, wonLegs } = score[player.userId];
        const playerScore = { wonSets, wonLegs } as PlayerScore;
        playerScore.displayName = `${player.user.name} ${player.user.surname}`;
        playerScore.username = player.userId;
        playerScore.pointsLeft = player.score;
        playerScore.isPlaying = player.userId === currentPlayerId;
        playerScore.throwsNeeded = Math.ceil(player.score / 50);

        if (player.history && player.history.length > 0) {
          const lastThrows = player.history[player.history.length - 1];
          playerScore.lastAverage =
            lastThrows.map(t => t.points).reduce((prev, curr) => (prev += curr)) / lastThrows.length;
        } else {
          playerScore.lastAverage = 0;
        }
        return playerScore;
      })
    )
  );

  private subs: Subscription = new Subscription();

  @ViewChild('dartboardContainer', { static: true }) dartboardContainer: ElementRef<HTMLElement>;

  private onResize() {
    if (!this.dartboardContainer) return;

    const container = this.dartboardContainer.nativeElement;
    this.dartboardWidth = container.clientWidth;
    this.dartboardHeight = container.clientHeight;
  }

  private onMatchEvent(event: MatchEvent) {
    this.matDialog.open(MatchEventDialogComponent, { data: event });
  }

  ngOnInit() {
    this.matchService.gameState$.subscribe(state => console.log(`current state is ${state}`));

    this.subs.add(fromEvent(window, 'resize').subscribe(() => this.onResize()));
    this.subs.add(this.matchService.matchEvent$.subscribe(event => this.onMatchEvent(event)));
  }

  ngAfterViewInit() {
    this.onResize();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSegmentsSelected(segments: Throw[]) {
    this.matchService.applyThrows(segments);
  }

  isPlayState(state: GAME_STATE) {
    return state === GAME_STATE.MATCH;
  }

  isPlayerOrderState(state: GAME_STATE) {
    return state === GAME_STATE.PLAYER_ORDER;
  }
}
