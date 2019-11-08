import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { LeagueService } from './league.service';
import { League } from './classes/models/league.model';

@Injectable()
export class LeagueResolve implements Resolve<League> {
  constructor(private leagueService: LeagueService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.leagueService.getLeague(route.paramMap.get('id')).pipe(take(1));
  }
}
