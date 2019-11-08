import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeagueListComponent } from './league-list/league-list.component';
import { AddLeagueComponent } from './add-league/add-league.component';
import { LeagueViewComponent } from './league-view/league-view.component';
import { LeaguePlayComponent } from './league-play/league-play.component';
import { LeagueResolve } from './league.resolve';

const routes: Routes = [
  { path: 'list', component: LeagueListComponent },
  { path: 'add', component: AddLeagueComponent },
  {
    path: 'view/:id',
    component: LeagueViewComponent,
    resolve: {
      league: LeagueResolve
    }
  },
  { path: 'play/:id', component: LeaguePlayComponent },
  { path: '', redirectTo: 'list' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeagueRoutingModule {}
