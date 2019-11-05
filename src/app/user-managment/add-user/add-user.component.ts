import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService, ApiKey } from '../../shared/api.service';
import { UserManagmentService } from '../user-managment.service';

@Component({
  selector: 'um-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.sass']
})
export class AddUserComponent implements OnInit {
  constructor(private userService: UserManagmentService) { }

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

    // this.userForm.get('gravatarUrl').valueChanges(url => )

    // this.subs.add(

    // )

  }

  create() {
    if (this.userForm.invalid || this.userForm.dirty) return;

    const user = this.userForm.value;
    // this.userService.createUser(user);
  }
}
