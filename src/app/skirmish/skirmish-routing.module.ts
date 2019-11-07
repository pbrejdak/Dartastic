import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SkirmishComponent } from './skirmish.component';

const routes: Routes = [
  { path: '/:state', component: SkirmishComponent },
  { path: '', redirectTo: 'pick-players', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkirmishRoutingModule { }
