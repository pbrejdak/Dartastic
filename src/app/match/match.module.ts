import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatchComponent } from './match/match.component';
import { DartboardComponent } from './dartboard/dartboard.component';
import { MatchService } from './match.service';
import { PlayerOrderComponent } from './player-order/player-order.component';
import { MatchEventDialogComponent } from './match-event-dialog/match-event-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [MatchComponent, DartboardComponent, PlayerOrderComponent, MatchEventDialogComponent],
  imports: [CommonModule, SharedModule, MatDialogModule],
  providers: [],
  exports: [MatchComponent],
  entryComponents: [MatchEventDialogComponent]
})
export class MatchModule {}
