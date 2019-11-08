import { Component, OnInit } from '@angular/core';
import { UserManagmentService } from '../user-managment.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../shared/classes/models/confirmation-dialog-data.model';
import { User } from '../../shared/classes/models/user.model';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'um-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  constructor(public userService: UserManagmentService, private dialog: MatDialog) {}

  ngOnInit() {}

  deleteUser(user: User) {
    const data = {} as ConfirmationDialogData;
    data.title = `Delete user ${user.name} ${user.surname}`;
    data.message = `You are about to delete user ${user.name} ${user.surname}` + '\nAre you sure?';
    this.dialog
      .open(ConfirmationDialogComponent, { data: data })
      .afterClosed()
      .pipe(
        filter(res => !!res),
        tap(() => {
          this.userService.removeUser(user).subscribe();
        })
      )
      .subscribe();
  }
}
