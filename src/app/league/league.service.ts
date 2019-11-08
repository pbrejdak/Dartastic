import { Injectable } from '@angular/core';
import { ApiKey, ApiService } from '../shared/api.service';
import { League } from './classes/models/league.model';
import { take, tap, switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  constructor(private api: ApiService) {}

  leagues$: Observable<League[]> = this.api.getData(ApiKey.LEAGUE);

  createLeague(league: League) {
    return this.leagues$.pipe(
      take(1),
      switchMap(leagues => this.api.saveData(ApiKey.LEAGUE, leagues ? leagues.concat(league) : [league]))
    );
  }

  getLeague(leagueId: string) {
    return this.leagues$.pipe(
      take(1),
      map(leagues => leagues.find(l => l.id === leagueId))
    );
  }
}
