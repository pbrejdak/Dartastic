import { Injectable } from '@angular/core';
import { MatchConfig } from '../shared/classes/models/match-config.model';
import { Router } from '@angular/router';
import { MatchService } from '../match/match.service';
import { MatchType } from '../match/classes/match-type.enum';

@Injectable({
  providedIn: 'root'
})
export class SkirmishService {
  constructor(private router: Router, private matchService: MatchService) {}

  config: MatchConfig;

  setConfig(config: MatchConfig) {
    this.config = config;

    this.router.navigate(['/skirmish/play']);

    this.matchService.initGame(this.config, MatchType.SKIRMISH);
  }
}
