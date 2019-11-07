import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../shared/classes/models/user.model';
import { UserManagmentService } from './user-managment.service';
import { take } from 'rxjs/operators';

@Injectable()
export class UserResolve implements Resolve<User> {

  constructor(private usersService: UserManagmentService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.usersService.getUser(route.paramMap.get('id')).pipe(take(1));
  }
}
