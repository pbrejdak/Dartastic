import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../shared/classes/models/user.model';
import { UserManagmentService } from './user-managment.service';
import { take, map } from 'rxjs/operators';
import { MatchResult } from '../match/classes/models/match-result.model';
import { ApiService, ApiKey } from '../shared/api.service';

@Injectable()
export class UserHistoryResolve implements Resolve<MatchResult[]> {
  constructor(private api: ApiService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const userId = route.paramMap.get('id');
    return this.api.getData(ApiKey.HISTORY).pipe(
      take(1),
      map(history => history.filter(h => h.participants.indexOf(userId) > -1))
    );
  }
}
