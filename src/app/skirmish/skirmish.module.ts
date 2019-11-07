import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkirmishRoutingModule } from './skirmish-routing.module';
import { SkirmishComponent } from './skirmish.component';
import { SharedModule } from '../shared/shared.module';
import { MatchModule } from '../match/match.module';

@NgModule({
  declarations: [SkirmishComponent],
  imports: [
    CommonModule,
    SkirmishRoutingModule,
    SharedModule,
    MatchModule
  ]
})
export class SkirmishModule { }
