import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../league.service';
import { MatchConfig } from '../../shared/classes/models/match-config.model';
import { MatchLeagueConfig } from '../classes/models/match-league-config.model';
import { GameMode } from '../../shared/classes/game-mode.enum';
import { User } from '../../shared/classes/models/user.model';

@Component({
  selector: 'app-league-list',
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.scss']
})
export class LeagueListComponent implements OnInit {
  constructor(public leagueService: LeagueService) {}

  ngOnInit() {}

  getGameModeName(mode: GameMode) {
    switch (mode) {
      case GameMode.SINGLE_OUT:
        return 'Single out';
    }
  }

  getPlayers(players: User[]) {
    return players.map(p => `${p.name} ${p.surname}`).join(', ');
  }
}
