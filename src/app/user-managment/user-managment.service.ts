import { Injectable } from '@angular/core';
import { ApiService, ApiKey } from '../shared/api.service';
import { ReplaySubject, Observable } from 'rxjs';
import { User } from './classes/models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
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

  createUser(user: User) {
    this.api.upsertUser(user)
  }
}
