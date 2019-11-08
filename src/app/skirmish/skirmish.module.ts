import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkirmishRoutingModule } from './skirmish-routing.module';
import { SkirmishComponent } from './skirmish.component';
import { SharedModule } from '../shared/shared.module';
import { MatchModule } from '../match/match.module';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { MatchConfiguratorModule } from '../match-configurator/match-configurator.module';
import { SkirmishPlayComponent } from './skirmish-play/skirmish-play.component';

@NgModule({
  declarations: [SkirmishComponent, ConfiguratorComponent, SkirmishPlayComponent],
  imports: [CommonModule, SkirmishRoutingModule, SharedModule, MatchModule, MatchConfiguratorModule],
  providers: []
})
export class SkirmishModule {}
