import { Injectable } from '@angular/core';
import { ApiService, ApiKey } from '../shared/api.service';
import { ReplaySubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../shared/classes/models/user.model';

@Injectable()
export class UserManagmentService {

  constructor(private api: ApiService) {
    this.initService();
  }

  private usersSource: ReplaySubject<User[]> = new ReplaySubject<User[]>();
  users$: Observable<User[]> = this.usersSource.asObservable();

  private async initService() {
    const users = await this.api.getData<User[]>(ApiKey.USER).toPromise();
    this.usersSource.next(users);
  }

  private addUser(user: User) {
    return this.usersSource.pipe(
      switchMap(users => this.api.saveData<User[]>(ApiKey.USER, users.concat(user)))
    );
  }

  createUser(user: User) {
    return this.addUser(user)
  }

  getUser(userId: string) {
    return this.users$.pipe(
      map(users => users.find(u => u.username === userId))
    );
  }
}
