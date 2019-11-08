import { Component, OnInit } from '@angular/core';
import { MatchConfig } from 'src/app/shared/classes/models/match-config.model';
import { SkirmishService } from '../skirmish.service';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {
  constructor(private skirmishService: SkirmishService) {}

  ngOnInit() {}

  configAccepted(config: MatchConfig) {
    this.skirmishService.setConfig(config);
  }
}
