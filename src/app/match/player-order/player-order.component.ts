import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../shared/classes/models/user.model';
import { ReplaySubject } from 'rxjs';
import { MatchService } from '../match.service';

@Component({
  selector: 'app-player-order',
  templateUrl: './player-order.component.html',
  styleUrls: ['./player-order.component.scss']
})
export class PlayerOrderComponent implements OnInit {
  constructor(private matchService: MatchService) {}

  @Input() players: UserExt[];

  ngOnInit() {}

  canProceed$ = new ReplaySubject();

  private checkCanProceed() {
    this.canProceed$.next(this.players.every(p => p.order));
  }

  pickOrder(player: UserExt) {
    if (player.order) {
      player.order = null;
    } else {
      const playersCount = this.players.length;

      const takenIndex = new Map<number, boolean>();
      for (let i = 0; i <= playersCount; i++) {
        takenIndex.set(i, false);
      }

      this.players.forEach(p => takenIndex.set(p.order, true));

      takenIndex.forEach((isTaken, order) => {
        if (!isTaken && !player.order) {
          player.order = order;
        }
      });
    }

    this.checkCanProceed();
  }

  startGame() {
    const userIds = this.players.sort((a, b) => (a.order > b.order ? 1 : -1)).map(u => u.username);
    this.matchService.setPlayerOrder(userIds);
  }
}

export interface UserExt extends User {
  order: number;
}
