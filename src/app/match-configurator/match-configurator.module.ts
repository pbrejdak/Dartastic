import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchConfiguratorComponent } from './match-configurator/match-configurator.component';
import { SharedModule } from '../shared/shared.module';
import { PlayerPickerComponent } from './player-picker/player-picker.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [MatchConfiguratorComponent, PlayerPickerComponent],
  imports: [CommonModule, SharedModule, MatStepperModule, MatChipsModule],
  exports: [MatchConfiguratorComponent]
})
export class MatchConfiguratorModule {}
