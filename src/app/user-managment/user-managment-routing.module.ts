import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserResolve } from './user.resolve';

const routes: Routes = [
  { path: 'add', component: AddUserComponent },
  { path: 'list', component: UserListComponent },
  {
    path: 'profile/:id', component: UserProfileComponent,
    resolve: {
      user: UserResolve
    }
  },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagmentRoutingModule { }
