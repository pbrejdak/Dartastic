import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatchComponent } from './match/match.component';
import { DartboardComponent } from './dartboard/dartboard.component';
import { MatchService } from './match.service';

@NgModule({
  declarations: [MatchComponent, DartboardComponent],
  imports: [CommonModule, SharedModule],
  providers: [MatchService]
})
export class MatchModule { }
