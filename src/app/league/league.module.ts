import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeagueRoutingModule } from './league-routing.module';
import { LeagueComponent } from './league.component';
import { LeagueListComponent } from './league-list/league-list.component';
import { LeagueViewComponent } from './league-view/league-view.component';
import { AddLeagueComponent } from './add-league/add-league.component';
import { LeaguePlayComponent } from './league-play/league-play.component';
import { SharedModule } from '../shared/shared.module';
import { MatchConfiguratorModule } from '../match-configurator/match-configurator.module';
import { LeagueResolve } from './league.resolve';

@NgModule({
  declarations: [LeagueComponent, LeagueListComponent, LeagueViewComponent, AddLeagueComponent, LeaguePlayComponent],
  imports: [CommonModule, LeagueRoutingModule, SharedModule, MatchConfiguratorModule],
  providers: [LeagueResolve]
})
export class LeagueModule {}
