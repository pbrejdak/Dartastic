import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../user-managment/classes/models/user.model';
import { UserPair } from '../classes/models/user-pair.model';
import { GameMode } from '../classes/game-mode.enum';
import { MatchService } from '../match.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.sass']
})
export class MatchComponent implements OnInit {

  constructor(
    private matchService: MatchService
  ) { }

  ngOnInit() {
  }

  onSegmentsSelected(segments: string[]) {
    this.matchService.applyThrows(segments);
  }

}
