import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserManagmentService } from '../user-managment.service';
import { Router } from '@angular/router';
import { User } from '../../shared/classes/models/user.model';

@Component({
  selector: 'um-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.sass']
})
export class AddUserComponent implements OnInit {
  constructor(private userService: UserManagmentService, private router: Router) {}

  private subs: Subscription = new Subscription();

  userForm: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      gravatarHash: new FormControl('')
    });
  }

  create() {
    if (this.userForm.invalid || !this.userForm.dirty) {
      return;
    }

    const user: User = this.userForm.value;
    user.wins = 0;
    this.userService.createUser(user).subscribe(
      res => {
        this.userForm.reset();
        this.router.navigate(['../', `profile/${user.username}`]);
      },
      err => {}
    );
  }
}
