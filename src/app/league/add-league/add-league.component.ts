import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchLeagueConfig } from '../classes/models/match-league-config.model';
import { LeagueService } from '../league.service';
import { League } from '../classes/models/league.model';
import { MatchConfiguratorComponent } from 'src/app/match-configurator/match-configurator/match-configurator.component';
import { MatchConfiguratorModule } from 'src/app/match-configurator/match-configurator.module';
import { Router, ActivatedRoute } from '@angular/router';
import { newGuid, shuffleArray } from 'src/app/shared/classes/helpers';
import { LeagueRound } from '../classes/models/league-round.model';

@Component({
  selector: 'app-add-league',
  templateUrl: './add-league.component.html',
  styleUrls: ['./add-league.component.scss']
})
export class AddLeagueComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private leagueService: LeagueService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  leagueForm: FormGroup = null;
  hideConfigurator: boolean = false;

  @ViewChild(MatchConfiguratorComponent, { static: true })
  configurator: MatchConfiguratorComponent;

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.leagueForm = this.fb.group({
      name: ['', Validators.required],
      config: [null, Validators.required]
    });
  }

  configAccepted(config: MatchLeagueConfig) {
    this.leagueForm.get('config').patchValue(config);
    this.hideConfigurator = true;
  }

  createLeague() {
    if (this.leagueForm.invalid) return;

    const form = this.leagueForm.value;

    const league = {} as League;
    league.name = form.name;
    league.config = form.config;
    league.participants = form.config.players.map(player => player.username);
    league.totalRounds = form.config.maxRounds;
    league.id = newGuid();

    league.rounds = [];

    for (let i = 0; i < league.totalRounds; i++) {
      const round = {} as LeagueRound;
      round.id = newGuid();
      round.number = i + 1;
      round.matches = [];

      const participants1 = shuffleArray([...league.participants]);
      const participants2 = shuffleArray([...league.participants]);

      for (const player1 of participants1) {
        for (const player2 of participants2) {
          if (player1 === player2) continue;

          if (round.matches.some(m => m.players.indexOf(player1) > -1 && m.players.indexOf(player2) > -1)) {
            continue;
          }

          round.matches.push({
            players: [player1, player2],
            winner: null
          });
        }
      }

      league.rounds.push(round);
    }

    this.leagueService.createLeague(league).subscribe(() => {
      this.router.navigate(['list'], { relativeTo: this.route.parent });
    });
  }

  resetConfiguration() {
    this.hideConfigurator = false;
    this.leagueForm.get('config').patchValue(null);
    this.cdr.detectChanges();
    // this.configurator.reset();
  }
}
