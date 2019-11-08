import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkirmishComponent } from './skirmish.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { SkirmishPlayComponent } from './skirmish-play/skirmish-play.component';
import { CanPlayGuard } from './can-play.guard';

const routes: Routes = [
  // { path: '/:sta', component: SkirmishComponent },
  { path: 'play', component: SkirmishPlayComponent, canActivate: [CanPlayGuard] },
  { path: 'configurator', component: ConfiguratorComponent },
  { path: '', redirectTo: 'configurator' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkirmishRoutingModule {}
