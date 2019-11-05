import { Component, OnInit } from '@angular/core';
import { UserManagmentService } from '../user-managment.service';

@Component({
  selector: 'um-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.sass']
})
export class UserListComponent implements OnInit {
  constructor(
    public userService: UserManagmentService
  ) { }

  ngOnInit() { }
}
