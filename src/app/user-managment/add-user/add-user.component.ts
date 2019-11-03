import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'um-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.sass']
})
export class AddUserComponent implements OnInit {
  constructor() {}

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
      gravatarUrl: new FormControl('', Validators.required)
    });

    // this.subs.add(

    // )
  }
}
