import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagmentRoutingModule } from './user-managment-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AddUserComponent, UserProfileComponent, UserListComponent],
  imports: [CommonModule, UserManagmentRoutingModule, SharedModule]
})
export class UserManagmentModule {}
