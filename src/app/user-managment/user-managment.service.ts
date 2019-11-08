import { Injectable } from '@angular/core';
import { ApiService, ApiKey } from '../shared/api.service';
import { ReplaySubject, Observable } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';
import { User } from '../shared/classes/models/user.model';

@Injectable()
export class UserManagmentService {
  constructor(private api: ApiService) {
    this.initService();
  }

  // private usersSource: ReplaySubject<User[]> = new ReplaySubject<User[]>();
  users$: Observable<User[]> = this.api.getData(ApiKey.USER).pipe(tap(data => console.log(data)));

  private async initService() {
    // this.users$ =
  }

  private addUser(user: User) {
    return this.users$.pipe(
      take(1),
      switchMap(users => this.api.saveData<User[]>(ApiKey.USER, users.concat(user)))
    );
  }

  private deleteUser(user: User) {
    return this.users$.pipe(
      take(1),
      switchMap(users => this.api.saveData<User[]>(ApiKey.USER, users.filter(u => u.username !== user.username)))
    );
  }

  createUser(user: User) {
    return this.addUser(user);
  }

  removeUser(user: User) {
    return this.deleteUser(user);
  }

  getUser(userId: string) {
    return this.users$.pipe(
      take(1),
      map(users => users.find(u => u.username === userId))
    );
  }
}
