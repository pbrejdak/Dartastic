import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { League } from '../classes/models/league.model';

@Component({
  selector: 'app-league-view',
  templateUrl: './league-view.component.html',
  styleUrls: ['./league-view.component.scss']
})
export class LeagueViewComponent implements OnInit {
  league: League;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.league = this.route.snapshot.data['league'];

    if (!this.league) {
      this.router.navigate(['list'], { relativeTo: this.route.parent });
    }
  }
}
