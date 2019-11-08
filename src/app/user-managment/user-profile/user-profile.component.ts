import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/classes/models/user.model';
import { MatchResult } from 'src/app/match/classes/models/match-result.model';

@Component({
  selector: 'um-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {
  user: User;
  history: MatchResult[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.user = this.route.snapshot.data['user'];

    if (!this.user) {
      this.router.navigate(['list'], { relativeTo: this.route.parent });
    }

    this.history = this.route.snapshot.data['history'];

    if (!history) {
      this.history = [];
    }
  }
}
