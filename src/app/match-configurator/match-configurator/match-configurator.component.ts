import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { ApiService, ApiKey } from '../../shared/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GameMode } from '../../shared/classes/game-mode.enum';
import { User } from '../../shared/classes/models/user.model';
import { MatchConfig } from '../../shared/classes/models/match-config.model';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-match-configurator',
  templateUrl: './match-configurator.component.html',
  styleUrls: ['./match-configurator.component.scss']
})
export class MatchConfiguratorComponent implements OnInit {
  constructor(private api: ApiService, private fb: FormBuilder) {}

  playersSelectGroup: FormGroup;
  rulesGroup: FormGroup;

  users$ = this.api.getData(ApiKey.USER);

  @Input()
  isLeague: boolean = false;

  @ViewChild(MatHorizontalStepper, { static: true })
  stepper: MatHorizontalStepper;

  gameModeOptions = GAME_MODE_OPTIONS;

  @Output()
  configAccepted: EventEmitter<MatchConfig> = new EventEmitter<MatchConfig>();

  ngOnInit() {
    this.buildForms();
  }

  private buildForms() {
    this.playersSelectGroup = this.fb.group({
      players: [[], Validators.compose([Validators.required, Validators.minLength(2)])]
    });

    this.rulesGroup = this.fb.group({
      legLength: [501, Validators.required],
      legsNeededToFinish: [3, Validators.required],
      setsNeededToFinish: [2, Validators.required],
      mode: [GameMode.SINGLE_OUT, Validators.required]
    });

    if (this.isLeague) {
      this.rulesGroup.addControl('rounds', new FormControl(3, Validators.required));
    }
  }

  playersSelected(players: User[]) {
    this.playersSelectGroup.get('players').setValue(players);
  }

  acceptConfig() {
    const players = this.playersSelectGroup.get('players').value;
    const { legLength, legsNeededToFinish, setsNeededToFinish, mode } = this.rulesGroup.value;
    const config = { players, mode, legLength, legsNeededToFinish, setsNeededToFinish } as MatchConfig;

    if (this.isLeague) {
      (config as any).maxRounds = 3;
    }

    this.configAccepted.emit(config);
  }

  reset() {
    this.stepper.reset();
  }
}

export const GAME_MODE_OPTIONS = [
  { name: 'SINGLE OUT', value: GameMode.SINGLE_OUT },
  { name: 'DOUBLE OUT', value: GameMode.DOUBLE_OUT },
  { name: 'DOUBLE IN', value: GameMode.DOUBLE_IN }
];
